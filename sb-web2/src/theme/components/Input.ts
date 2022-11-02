import { ComponentStyleConfig } from '@chakra-ui/react';

export const InputStyles: ComponentStyleConfig = {
    baseStyle: {
        _focus: {
            boxShadow: 'none'
        }
    },
    variants: {
        brand: (props: any) => {
            return {
                field: {
                    ...props.theme.components.Input.variants.outline(props).field,
                    py: '2',
                    px: '3',
                    borderWidth: '2px'
                },
            };
        },
    },
};
