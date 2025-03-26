import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { View } from 'react-native';

const VStackVariants = cva('flex-col', {
    variants: {
        space: {
            none: 'gap-0',
            xs: 'gap-1',
            sm: 'gap-2',
            md: 'gap-3',
            lg: 'gap-4',
            xl: 'gap-6',
        },
        reversed: {
            true: 'flex-col-reverse',
        },
    },
    defaultVariants: {
        space: 'md',
        reversed: false,
    },
});

type VStackProps = React.ComponentPropsWithoutRef<typeof View> &
    VariantProps<typeof VStackVariants>;

const VStack = React.forwardRef<React.ElementRef<typeof View>, VStackProps>(
    ({ className, space, reversed, ...props }, ref) => {
        return (
            <View
                className={VStackVariants({
                    space,
                    reversed,
                    class: className,
                })}
                {...props}
                ref={ref}
            />
        );
    },
);
VStack.displayName = 'VStack';

export { VStack };
export type { VStackProps };
