import { ChevronDown } from '@/lib/icons/ChevronDown';
import { cn } from '@/lib/utils';
import * as NavigationMenuPrimitive from '@rn-primitives/navigation-menu';
import { cva } from 'class-variance-authority';
import * as React from 'react';
import { Platform, View } from 'react-native';
import Animated, {
    Extrapolation,
    FadeInLeft,
    FadeOutLeft,
    interpolate,
    useAnimatedStyle,
    useDerivedValue,
    withTiming,
} from 'react-native-reanimated';

const NavigationMenu = React.forwardRef<
    NavigationMenuPrimitive.RootRef,
    NavigationMenuPrimitive.RootProps
>(({ className, children, ...props }, ref) => (
    <NavigationMenuPrimitive.Root
        ref={ref}
        className={cn(
            'relative z-10 flex flex-row max-w-max items-center justify-center rounded-base border-border border-2 bg-main',
            className,
        )}
        {...props}
    >
        {children}
        {Platform.OS === 'web' && props.value && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = React.forwardRef<
    NavigationMenuPrimitive.ListRef,
    NavigationMenuPrimitive.ListProps
>(({ className, ...props }, ref) => (
    <NavigationMenuPrimitive.List
        ref={ref}
        className={cn(
            'web:group flex flex-1 flex-row web:list-none items-center justify-center gap-1',
            className,
        )}
        {...props}
    />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const navigationMenuTriggerStyle = cva(
    'web:group web:inline-flex flex-row h-10 native:h-12 native:px-3 w-max items-center justify-center rounded-md bg-main px-4 py-2 text-sm font-medium web:transition-colors web:focus:outline-none web:disabled:pointer-events-none disabled:opacity-50',
);

const NavigationMenuTrigger = React.forwardRef<
    NavigationMenuPrimitive.TriggerRef,
    NavigationMenuPrimitive.TriggerProps
>(({ className, children, ...props }, ref) => {
    const { value } = NavigationMenuPrimitive.useRootContext();
    const { value: itemValue } = NavigationMenuPrimitive.useItemContext();

    const progress = useDerivedValue(() =>
        value === itemValue
            ? withTiming(1, { duration: 250 })
            : withTiming(0, { duration: 200 }),
    );
    const chevronStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${progress.value * 180}deg` }],
        opacity: interpolate(
            progress.value,
            [0, 1],
            [1, 0.8],
            Extrapolation.CLAMP,
        ),
    }));

    return (
        <NavigationMenuPrimitive.Trigger
            ref={ref}
            className={cn(
                navigationMenuTriggerStyle(),
                'web:group gap-1.5',
                value === itemValue && 'bg-main',
                className,
            )}
            {...props}
        >
            <>{children}</>
            <Animated.View style={chevronStyle}>
                <ChevronDown
                    size={12}
                    className={cn(
                        'relative text-mtext h-3 w-3 web:transition web:duration-200',
                    )}
                    aria-hidden={true}
                />
            </Animated.View>
        </NavigationMenuPrimitive.Trigger>
    );
});
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = React.forwardRef<
    NavigationMenuPrimitive.ContentRef,
    NavigationMenuPrimitive.ContentProps & {
        portalHost?: string;
    }
>(({ className, children, portalHost, ...props }, ref) => {
    const { value } = NavigationMenuPrimitive.useRootContext();
    const { value: itemValue } = NavigationMenuPrimitive.useItemContext();
    return (
        <NavigationMenuPrimitive.Portal hostName={portalHost}>
            <NavigationMenuPrimitive.Content
                ref={ref}
                className={cn(
                    'w-full native:border-2 native:border-border native:rounded-base native:bg-main native:text-mtext native:overflow-hidden',
                    value === itemValue
                        ? 'web:animate-in web:fade-in web:slide-in-from-right-20'
                        : 'web:animate-out web:fade-out web:slide-out-to-left-20',
                    className,
                )}
                {...props}
            >
                <Animated.View
                    entering={Platform.OS !== 'web' ? FadeInLeft : undefined}
                    exiting={Platform.OS !== 'web' ? FadeOutLeft : undefined}
                >
                    {children}
                </Animated.View>
            </NavigationMenuPrimitive.Content>
        </NavigationMenuPrimitive.Portal>
    );
});
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = NavigationMenuPrimitive.Link;

const NavigationMenuViewport = React.forwardRef<
    NavigationMenuPrimitive.ViewportRef,
    NavigationMenuPrimitive.ViewportProps
>(({ className, ...props }, ref) => {
    return (
        <View className={cn('absolute left-0 top-full flex justify-center')}>
            <View
                className={cn(
                    'web:origin-top-center relative mt-1.5 web:h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-base border-2 border-border bg-main text-mtext web:animate-in web:zoom-in-90',
                    className,
                )}
                ref={ref}
                {...props}
            >
                <NavigationMenuPrimitive.Viewport />
            </View>
        </View>
    );
});
NavigationMenuViewport.displayName =
    NavigationMenuPrimitive.Viewport.displayName;

const NavigationMenuIndicator = React.forwardRef<
    NavigationMenuPrimitive.IndicatorRef,
    NavigationMenuPrimitive.IndicatorProps
>(({ className, ...props }, ref) => {
    const { value } = NavigationMenuPrimitive.useRootContext();
    const { value: itemValue } = NavigationMenuPrimitive.useItemContext();

    return (
        <NavigationMenuPrimitive.Indicator
            ref={ref}
            className={cn(
                'top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden',
                value === itemValue
                    ? 'web:animate-in web:fade-in'
                    : 'web:animate-out web:fade-out',
                className,
            )}
            {...props}
        >
            <View className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-white" />
        </NavigationMenuPrimitive.Indicator>
    );
});
NavigationMenuIndicator.displayName =
    NavigationMenuPrimitive.Indicator.displayName;

export {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
    NavigationMenuViewport,
};
