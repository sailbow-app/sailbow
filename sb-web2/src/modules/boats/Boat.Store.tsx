import { createContext, FunctionComponent, ReactNode, useReducer, useContext, Dispatch } from 'react';

import { createBoat, getAllBoats, getBannerImages, getBoat, getCrew } from 'modules/boats/Boat.Service';
import {
    Boat,
    BoatState,
    CreateBoat,
    ModuleName,
    Photo,
    ModuleMode,
    ModuleSettings,
    Module,
    ModuleData,
    ModuleExtended,
    Role,
    ModuleType,
    Modules,
} from 'modules/boats/Boat.Types';
import { useAuthStore } from 'modules/auth/Auth.Store';
import { upsertModule } from './boat-modules/modules/Modules.Service';

export enum BoatActionType {
    SetError,
    SetActiveBoat,
    SetCreateLoading,
    SetGetAllLoading,
    SetGetLoading,
    SetAllBoats,
    SetModule,
    SetAllModules,
    SetModuleMode,
}

interface PayloadSetActiveBoat {
    boat?: Boat;
}

interface PayloadLoading {
    loading: boolean;
}

interface PayloadSetAllBoats {
    boats: Boat[];
}

interface PayloadError {
    error: any;
}

interface PayloadSetModuleMode {
    moduleId: string;
    mode: ModuleMode;
}

interface PayloadSetModule {
    moduleId: string;
    module: ModuleExtended<any>;
}

interface PayloadSetAllModules {
    modules: Modules<any>;
}

interface BoatAction {
    type: BoatActionType;
    payload:
        | PayloadSetActiveBoat
        | PayloadError
        | PayloadLoading
        | PayloadSetAllBoats
        | PayloadSetModule
        | PayloadSetModuleMode
        | PayloadSetAllModules;
}

interface BoatProviderProps {
    children: ReactNode;
}

export const initialBoatState: BoatState = {
    activeBoat: undefined,
    loading: {
        create: false,
        get: false,
        getAll: false,
    },
    boats: [],
};

const BoatStateContext = createContext<BoatState | undefined>(undefined);
const BoatDispatchContext = createContext<Dispatch<BoatAction> | undefined>(undefined);

const boatReducer = (boatState: BoatState, action: BoatAction): BoatState => {
    switch (action.type) {
        case BoatActionType.SetActiveBoat: {
            const { boat } = action.payload as PayloadSetActiveBoat;

            return {
                ...boatState,
                activeBoat: boat
                    ? {
                          ...boat,
                          modules: {},
                      }
                    : undefined,
            };
        }
        case BoatActionType.SetCreateLoading: {
            const { loading } = action.payload as PayloadLoading;
            const nextState: BoatState = { ...boatState, loading: { ...boatState.loading, create: loading } };

            return nextState;
        }
        case BoatActionType.SetError: {
            const payload = action.payload as PayloadError;
            const nextState: BoatState = { ...boatState, error: { ...payload.error } };

            return nextState;
        }
        case BoatActionType.SetGetAllLoading: {
            const { loading } = action.payload as PayloadLoading;
            const nextState: BoatState = { ...boatState, loading: { ...boatState.loading, getAll: loading } };

            return nextState;
        }
        case BoatActionType.SetGetLoading: {
            const { loading } = action.payload as PayloadLoading;
            const nextState: BoatState = { ...boatState, loading: { ...boatState.loading, get: loading } };

            return nextState;
        }

        case BoatActionType.SetAllBoats: {
            const payload = action.payload as PayloadSetAllBoats;
            const nextState: BoatState = { ...boatState, boats: payload.boats };

            return nextState;
        }

        case BoatActionType.SetModule: {
            const { module, moduleId } = action.payload as PayloadSetModule;

            return {
                ...boatState,
                activeBoat: {
                    ...boatState.activeBoat!,
                    modules: {
                        ...boatState.activeBoat!.modules,
                        [moduleId]: module,
                    },
                },
            };
        }

        case BoatActionType.SetModuleMode: {
            const { mode, moduleId } = action.payload as PayloadSetModuleMode;

            return {
                ...boatState,
                activeBoat: {
                    ...boatState.activeBoat!,
                    modules: {
                        ...boatState.activeBoat!.modules,
                        [moduleId]: {
                            ...boatState.activeBoat!.modules[moduleId],
                            mode,
                        },
                    },
                },
            };
        }

        case BoatActionType.SetAllModules: {
            const { modules } = action.payload as PayloadSetAllModules;

            return {
                ...boatState,
                activeBoat: {
                    ...boatState.activeBoat!,
                    modules,
                },
            };
        }

        default: {
            throw new Error(`Invalid action -- ${action.type}`);
        }
    }
};

export const BoatProvider: FunctionComponent<BoatProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(boatReducer, initialBoatState);

    return (
        <BoatStateContext.Provider value={state}>
            <BoatDispatchContext.Provider value={dispatch}>{children}</BoatDispatchContext.Provider>
        </BoatStateContext.Provider>
    );
};

const useBoatState = (): BoatState => {
    const context = useContext(BoatStateContext);

    if (context === undefined) {
        throw new Error('UseBoatState must be used within BoatProvider');
    }

    return context;
};

const useBoatDispatch = (): Dispatch<BoatAction> => {
    const context = useContext(BoatDispatchContext);

    if (context === undefined) {
        throw new Error('UseBoatState must be used within BoatProvider');
    }

    return context;
};

interface BoatActionApis {
    createBoat: (boat: CreateBoat) => Promise<Boat | null>;
    getImages: (value: string, page: number) => Promise<Photo[]>;
    getBoat: (boatId: string) => Promise<Boat | null>;
    getBoats: () => Promise<Boat[] | null>;
    removeActiveBoat: () => void;
    getModuleData: (boatId: string, moduleId: string) => Promise<void>;
    addModule: (moduleType: ModuleType) => void;
    removeModule: (moduleId: string) => void;
    setModuleMode: (moduleId: string, mode: ModuleMode) => void;
    saveModuleData: <T>(moduleId: string, data: ModuleData<T>[]) => void;
    selectOption: (moduleId: string, optionId: string) => void;
    saveWidgetSettings: (moduleId: string, settings: ModuleSettings) => void;
}

export const useBoat = (): [BoatState, BoatActionApis] => {
    const dispatch = useBoatDispatch();
    const state = useBoatState();
    const [{ user }] = useAuthStore();

    const actionApis: BoatActionApis = {
        createBoat: async (boat: CreateBoat) => {
            dispatch({ type: BoatActionType.SetCreateLoading, payload: { loading: true } });
            try {
                const response = await createBoat(boat);

                dispatch({ type: BoatActionType.SetCreateLoading, payload: { loading: false } });
                return response;
            } catch (error: any) {
                dispatch({ type: BoatActionType.SetCreateLoading, payload: { loading: false } });
                dispatch({ type: BoatActionType.SetError, payload: { error: error.response } });
                return null;
            }
        },
        removeActiveBoat: () => {
            dispatch({ type: BoatActionType.SetActiveBoat, payload: { boat: undefined } });
        },
        getBoat: async (boatId: string) => {
            dispatch({ type: BoatActionType.SetGetLoading, payload: { loading: true } });
            try {
                const boatResponse = await getBoat(boatId);
                const crew = await getCrew(boatId);

                const boat = {
                    ...boatResponse,
                    crew,
                };

                dispatch({
                    type: BoatActionType.SetActiveBoat,
                    payload: {
                        boat,
                    },
                });
                dispatch({ type: BoatActionType.SetGetLoading, payload: { loading: false } });

                return boat;
            } catch (error: any) {
                dispatch({ type: BoatActionType.SetGetLoading, payload: { loading: false } });
                dispatch({ type: BoatActionType.SetError, payload: { error: error.response } });
                return null;
            }
        },
        getImages: (value: string, page: number) => {
            return getBannerImages(value, page);
        },
        getBoats: async () => {
            dispatch({ type: BoatActionType.SetGetAllLoading, payload: { loading: true } });
            try {
                const response = await getAllBoats();

                dispatch({ type: BoatActionType.SetAllBoats, payload: { boats: response } });
                dispatch({ type: BoatActionType.SetGetAllLoading, payload: { loading: false } });

                return response;
            } catch (error: any) {
                dispatch({ type: BoatActionType.SetGetAllLoading, payload: { loading: false } });
                dispatch({ type: BoatActionType.SetError, payload: { error: error.response } });
                return null;
            }
        },
        getModuleData: async (boatId: string, moduleId: string) => {
            return new Promise<any | null>((res, rej) => {
                switch (moduleId) {
                    case '1':
                        return setTimeout(() => {
                            dispatch({
                                type: BoatActionType.SetModule,
                                payload: {
                                    moduleId,
                                    module: {
                                        ...state.activeBoat!.modules[moduleId],
                                        data: [],
                                        dataLoaded: true,
                                        loading: false,
                                    },
                                },
                            });
                        }, 500);
                    case '2':
                        return setTimeout(() => {
                            dispatch({
                                type: BoatActionType.SetModule,
                                payload: {
                                    moduleId,
                                    module: {
                                        ...state.activeBoat!.modules[moduleId],
                                        data: [],
                                        dataLoaded: true,
                                        loading: false,
                                    },
                                },
                            });
                        }, 2000);
                }
            });
        },
        addModule: async <T,>(moduleType: ModuleType) => {
            // make api call to add module here
            const newBoat = { ...state.activeBoat! };
            const tempId = (Object.keys(newBoat!.modules).length + 1).toString();
            // {
            //     "boatId": "string",
            //     "type": "Date",
            //     "name": "string",
            //     "description": "string",
            //     "order": 0,
            //     "finalizedOptionId": 0,
            //     "settings": {
            //       "allowMultiple": true,
            //       "anonymousVoting": true,
            //       "deadline": "2022-10-27T18:28:06.909Z"
            //     },
            //     "data": [
            //       {
            //         "votes": [
            //           "string"
            //         ],
            //         "author": "string",
            //         "id": "string"
            //       }
            //     ],
            //     "id": "string"
            //   }

            const module: Pick<Module<T>, 'name' | 'description' | 'settings' | 'order' | 'data'> = {
                name: moduleType,
                order: Object.keys(newBoat!.modules).length + 1,
                description: '',
                data: [],
                settings: {
                    allowMultiple: true,
                    anonymousVoting: true,
                    deadline: '',
                },
            };

            // dispatch({
            //     type: BoatActionType.SetModule,
            //     payload: {
            //         moduleId: '',
            //         module: {
            //             ...module,
            //             id: '',
            //             type: ModuleType.Date,
            //             totalVotes: 0,

            //             loading: true,
            //             dataLoaded: false,
            //             mode: ModuleMode.Edit,
            //         },
            //     },
            // });

            const response = await upsertModule(newBoat.id, {
                name: 'date',
                description: 'test',
                order: 1,
                settings: {
                    allowMultiple: true,
                    anonymousVoting: false,
                },
                data: [
                    {
                        type: 'date',
                        startDate: '2022-10-26T20:17:04Z',
                        endDate: '2022-10-28T20:17:04Z',
                    },
                ],
            });
            console.log(response);

            dispatch({
                type: BoatActionType.SetModule,
                payload: {
                    moduleId: response.id,
                    module: {
                        ...response,
                        loading: false,
                        dataLoaded: false,
                        mode: ModuleMode.Edit,
                    },
                },
            });
        },
        saveModuleData: <T,>(moduleId: string, data: ModuleData<T>[]) => {
            const module: ModuleExtended<T> = state.activeBoat!.modules[moduleId];

            module.data = data;
            module.mode = ModuleMode.View;

            dispatch({
                type: BoatActionType.SetModule,
                payload: {
                    moduleId,
                    module,
                },
            });
        },
        setModuleMode: (moduleId: string, mode: ModuleMode) => {
            dispatch({
                type: BoatActionType.SetModuleMode,
                payload: {
                    moduleId,
                    mode,
                },
            });
        },
        removeModule: (moduleId: string) => {
            const modules = { ...state.activeBoat!.modules };
            delete modules[moduleId];

            dispatch({
                type: BoatActionType.SetAllModules,
                payload: {
                    moduleId,
                    modules,
                },
            });
        },
        selectOption: (moduleId: string, optionId: string) => {
            // api call here

            const modules = { ...state.activeBoat!.modules };
            const module = { ...modules[moduleId] };

            const optionIdx = module.data.findIndex((d) => d.id === optionId);

            if (optionIdx !== -1) {
                module.data[optionIdx].selected = true;
            }

            dispatch({
                type: BoatActionType.SetModule,
                payload: {
                    moduleId,
                    module,
                },
            });
        },
        saveWidgetSettings: (moduleId: string, settings: ModuleSettings) => {
            const modules = state.activeBoat!.modules;
            const module = modules[moduleId];

            if (module) {
                module.settings = settings;
            }

            dispatch({
                type: BoatActionType.SetModule,
                payload: {
                    moduleId,
                    module,
                },
            });
        },
    };

    return [useBoatState(), actionApis];
};
