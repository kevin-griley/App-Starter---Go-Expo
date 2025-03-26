import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { View } from 'react-native';

const HStackVariants = cva('flex-row', {
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
            true: 'flex-row-reverse',
        },
    },
    defaultVariants: {
        space: 'md',
        reversed: false,
    },
});

type HStackProps = React.ComponentPropsWithoutRef<typeof View> &
    VariantProps<typeof HStackVariants>;

const HStack = React.forwardRef<React.ElementRef<typeof View>, HStackProps>(
    ({ className, space, reversed, ...props }, ref) => {
        return (
            <View
                className={HStackVariants({
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
HStack.displayName = 'HStack';

export { HStack };
export type { HStackProps };
