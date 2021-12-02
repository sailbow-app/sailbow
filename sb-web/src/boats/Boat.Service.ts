import axios, { AxiosResponse } from 'axios';
import { BoatEndpoints, ImageSearchEndpoints } from 'util/http/Endpoints';
import { Boat, CreateBoat, Photo } from 'boats/Boat.Types';
import { Http } from 'util/http/Http';

export const getBannerImages = async (value: string, newPage: number): Promise<Photo[]> => {
    const { data }: AxiosResponse = await axios({
        ...ImageSearchEndpoints.Search,
        params: {
            query: value,
            perPage: 10,
            page: newPage,
        },
    });

    console.log(data);

    const photos: Photo[] = [];

    // data.photos.forEach((photo: any) => {
    //     photos.push({
    //         src: photo.src.landscape,
    //         width: 3,
    //         height: 2,
    //         photographer: photo.photographer,
    //         photographerUrl: photo.photographer_url,
    //     });
    // });

    return photos;
};

export const createBoatService = async (boat: CreateBoat): Promise<Boat> => {
    const { data }: AxiosResponse<Boat> = await Http({
        ...BoatEndpoints.Create,
        data: { ...boat },
    });

    return data;
};

export const getBoatService = async (boatId: string): Promise<Boat> => {
    const { data }: AxiosResponse<Boat> = await Http({
        method: BoatEndpoints.Get.method,
        url: `${BoatEndpoints.Get.url}/${boatId}`,
    });

    return data;
};
