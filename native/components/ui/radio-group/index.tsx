import { cn } from '@/lib/utils';
import * as RadioGroupPrimitive from '@rn-primitives/radio-group';
import * as React from 'react';
import { View } from 'react-native';

const RadioGroup = React.forwardRef<
    RadioGroupPrimitive.RootRef,
    RadioGroupPrimitive.RootProps
>(({ className, ...props }, ref) => {
    return (
        <RadioGroupPrimitive.Root
            className={cn('web:grid gap-2', className)}
            {...props}
            ref={ref}
        />
    );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
    RadioGroupPrimitive.ItemRef,
    RadioGroupPrimitive.ItemProps
>(({ className, ...props }, ref) => {
    return (
        <RadioGroupPrimitive.Item
            ref={ref}
            className={cn(
                'aspect-square h-5 w-5 native:h-6 native:w-6 rounded-full border-2 border-border justify-center items-center text-text web:ring-offset-white web:focus:outline-none web:focus-visible:ring-2 web:focus-visible:ring-black web:focus-visible:ring-offset-2',
                props.disabled && 'web:cursor-not-allowed opacity-50',
                className,
            )}
            {...props}
        >
            <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                <View className="aspect-square h-2.5 w-2.5 bg-text rounded-full" />
            </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
    );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
