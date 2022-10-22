import { FunctionComponent, useEffect } from 'react';

import { Box, Center, Flex } from '@chakra-ui/react';

import { Boat } from 'modules/boats/Boat.Types';
import { useBoat } from 'modules/boats/Boat.Store';
import { BoatCard } from 'modules/boats/common';
import { PageSpinner } from 'shared/page-spinner/PageSpinner';
import { SbFilterIcon, SbSearchIcon } from 'shared/icons/Icons';
import { Input } from 'shared/input/Input';

import './BoatHome.scss';

export const BoatHome: FunctionComponent = () => {
    const [{ boats, loading }, { getBoats }] = useBoat();

    useEffect(() => {
        (async () => {
            await getBoats();
        })();
    }, []); // eslint-disable-line

    return (
        <Box px={{ base: 0, md: 4 }} className="sb-home" w="100%">
            {!loading.getAll && boats ? (
                <>
                    {boats.length ? (
                        <>
                            <Flex w="100%" justifyContent="space-between" alignItems="center" gap="4" pt="6">
                                <Input
                                    leftIcon={<SbSearchIcon />}
                                    rightIconButton={<SbFilterIcon />}
                                    placeholder="Search boats..."
                                    w="100%"
                                />
                            </Flex>
                            <Box className="container" mt="8">
                                {boats.map((boat: Boat) => {
                                    return <BoatCard boat={boat} key={boat.id} />;
                                })}
                            </Box>
                        </>
                    ) : (
                        <Center>No Boats</Center>
                    )}
                </>
            ) : (
                <PageSpinner loading={loading.getAll} />
            )}
        </Box>
    );
};
