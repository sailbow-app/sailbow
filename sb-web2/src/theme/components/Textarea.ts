import { ComponentStyleConfig, theme as ChakraTheme } from '@chakra-ui/react';

export const Textarea: ComponentStyleConfig = {
    defaultProps: {
        focusBorderColor: 'transparent',
    },
    baseStyle: {
        backgroundColor: 'transparent',
        borderTopWidth: '0',
        borderLeftWidth: '0',
        borderRightWidth: '0',
        borderRadius: '0',
        borderBottomWidth: '2px',
        fontWeight: 'normal',
        transition: 'border 0.25s ease-in-out',
        _hover: {
            backgroundColor: 'transparent',
            borderColor: 'brand.secondary',
        },
        _focus: {
            backgroundColor: 'transparent',
            borderColor: 'brand.secondary',
        },
        _invalid: {
            borderColor: 'brand.error',
            bg: 'transparent',
        },
    },
};
