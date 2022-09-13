import { FC } from 'react';

import { useAuthStore } from 'modules/auth/Auth.Store';

import { Flex } from '@chakra-ui/react';

export const Navbar: FC = () => {
    const [{ user }] = useAuthStore();

    return <Flex>Private navbar</Flex>;
};
