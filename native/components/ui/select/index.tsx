import { Check } from '@/lib/icons/Check';
import { ChevronDown } from '@/lib/icons/ChevronDown';
import { ChevronUp } from '@/lib/icons/ChevronUp';
import { cn } from '@/lib/utils';
import * as SelectPrimitive from '@rn-primitives/select';
import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

type Option = SelectPrimitive.Option;

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
    SelectPrimitive.TriggerRef,
    SelectPrimitive.TriggerProps
>(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Trigger
        ref={ref}
        className={cn(
            'flex flex-row h-10 native:h-12 items-center text-sm text-text font-serif bg-bw justify-between rounded-base border-2 border-border px-3 py-2 web:ring-offset-white web:focus:outline-none web:focus:ring-2 web:focus:ring-black web:focus:ring-offset-2 [&>span]:line-clamp-1',
            props.disabled && 'web:cursor-not-allowed opacity-50',
            className,
        )}
        {...props}
    >
        <>{children}</>
        <ChevronDown
            size={16}
            aria-hidden={true}
            className="text-text opacity-70"
        />
    </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

/**
 * Platform: WEB ONLY
 */
const SelectScrollUpButton = ({
    className,
    ...props
}: SelectPrimitive.ScrollUpButtonProps) => {
    if (Platform.OS !== 'web') {
        return null;
    }
    return (
        <SelectPrimitive.ScrollUpButton
            className={cn(
                'flex web:cursor-default items-center justify-center py-1',
                className,
            )}
            {...props}
        >
            <ChevronUp size={14} className="text-text" />
        </SelectPrimitive.ScrollUpButton>
    );
};

/**
 * Platform: WEB ONLY
 */
const SelectScrollDownButton = ({
    className,
    ...props
}: SelectPrimitive.ScrollDownButtonProps) => {
    if (Platform.OS !== 'web') {
        return null;
    }
    return (
        <SelectPrimitive.ScrollDownButton
            className={cn(
                'flex web:cursor-default items-center justify-center py-1',
                className,
            )}
            {...props}
        >
            <ChevronDown size={14} className="text-text" />
        </SelectPrimitive.ScrollDownButton>
    );
};

const SelectContent = React.forwardRef<
    SelectPrimitive.ContentRef,
    SelectPrimitive.ContentProps & {
        portalHost?: string;
    }
>(({ className, children, position = 'popper', portalHost, ...props }, ref) => {
    const { open } = SelectPrimitive.useRootContext();

    return (
        <SelectPrimitive.Portal hostName={portalHost}>
            <SelectPrimitive.Overlay
                style={
                    Platform.OS !== 'web' ? StyleSheet.absoluteFill : undefined
                }
            >
                <Animated.View
                    className="z-50"
                    entering={FadeIn}
                    exiting={FadeOut}
                >
                    <SelectPrimitive.Content
                        ref={ref}
                        className={cn(
                            'relative z-50 max-h-96 min-w-[8rem] rounded-base border-2 border-border bg-bw data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                            position === 'popper' &&
                                'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
                            open
                                ? 'web:zoom-in-95 web:animate-in web:fade-in-0'
                                : 'web:zoom-out-95 web:animate-out web:fade-out-0',
                            className,
                        )}
                        position={position}
                        {...props}
                    >
                        <SelectScrollUpButton />
                        <SelectPrimitive.Viewport
                            className={cn(
                                'p-1 pr-2',
                                position === 'popper' &&
                                    'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
                            )}
                        >
                            {children}
                        </SelectPrimitive.Viewport>
                        <SelectScrollDownButton />
                    </SelectPrimitive.Content>
                </Animated.View>
            </SelectPrimitive.Overlay>
        </SelectPrimitive.Portal>
    );
});
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
    SelectPrimitive.LabelRef,
    SelectPrimitive.LabelProps
>(({ className, ...props }, ref) => (
    <SelectPrimitive.Label
        ref={ref}
        className={cn(
            'border-2 border-transparent py-1.5 native:pb-2 pl-8 native:pl-10 pr-2 text-text font-serif text-sm native:text-base font-medium',
            className,
        )}
        {...props}
    />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
    SelectPrimitive.ItemRef,
    SelectPrimitive.ItemProps
>(({ className, children: _, ...props }, ref) => (
    <SelectPrimitive.Item
        ref={ref}
        className={cn(
            'relative web:group flex flex-row w-full web:cursor-default web:select-none items-center rounded-base border-2 border-transparent py-1.5 native:py-2 pl-8 native:pl-10 pr-2 web:hover:border-border active:border-border web:outline-none web:focus:border-border',
            props.disabled && 'web:pointer-events-none opacity-50',
            className,
        )}
        {...props}
    >
        <View className="absolute left-2 native:left-3.5 flex h-3.5 native:pt-px w-3.5 items-center justify-center">
            <SelectPrimitive.ItemIndicator>
                <Check size={16} strokeWidth={3} className="text-text" />
            </SelectPrimitive.ItemIndicator>
        </View>
        <SelectPrimitive.ItemText className="text-sm text-text font-serif native:text-base web:group-focus:text-text" />
    </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
    SelectPrimitive.SeparatorRef,
    SelectPrimitive.SeparatorProps
>(({ className, ...props }, ref) => (
    <SelectPrimitive.Separator
        ref={ref}
        className={cn('-mx-1 my-1 h-px bg-border', className)}
        {...props}
    />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
    type Option,
};
