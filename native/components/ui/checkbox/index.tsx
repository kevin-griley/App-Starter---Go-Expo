import { Check } from '@/lib/icons/Check';
import { cn } from '@/lib/utils';
import * as CheckboxPrimitive from '@rn-primitives/checkbox';
import * as React from 'react';
import { Platform } from 'react-native';

const Checkbox = React.forwardRef<
    CheckboxPrimitive.RootRef,
    CheckboxPrimitive.RootProps
>(({ className, ...props }, ref) => {
    return (
        <CheckboxPrimitive.Root
            ref={ref}
            className={cn(
                'web:peer h-4 w-4 native:h-[20] native:w-[20] shrink-0 rounded-sm native:rounded border-2 border-border web:ring-offset-white web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-black web:focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                props.checked && 'bg-main',
                className,
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator
                className={cn('items-center justify-center h-full w-full')}
            >
                <Check
                    size={12}
                    strokeWidth={Platform.OS === 'web' ? 2.5 : 3.5}
                    className="text-mtext"
                />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
