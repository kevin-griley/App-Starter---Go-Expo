import { cn } from '@/lib/utils';
import * as SeparatorPrimitive from '@rn-primitives/separator';
import * as React from 'react';

const Separator = React.forwardRef<
    SeparatorPrimitive.RootRef,
    SeparatorPrimitive.RootProps
>(
    (
        { className, orientation = 'horizontal', decorative = true, ...props },
        ref,
    ) => (
        <SeparatorPrimitive.Root
            ref={ref}
            decorative={decorative}
            orientation={orientation}
            className={cn(
                'shrink-0 bg-border',
                orientation === 'horizontal' ? 'h-0.5 w-full' : 'h-full w-0.5',
                className,
            )}
            {...props}
        />
    ),
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
