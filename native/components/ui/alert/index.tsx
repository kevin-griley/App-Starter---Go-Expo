import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { useTheme } from '@react-navigation/native';
import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react-native';
import * as React from 'react';
import { View, type ViewProps } from 'react-native';

const alertVariants = cva(
    'relative w-full rounded-base border-2 border-border p-4 shadow shadow-shadow',
    {
        variants: {
            variant: {
                default: 'bg-main',
                destructive: 'bg-black',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

const alertTextVariants = cva(
    'pl-7 mb-1 font-medium text-base leading-none tracking-tight',
    {
        variants: {
            variant: {
                default: 'text-mtext',
                destructive: 'text-white',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

const Alert = React.forwardRef<
    React.ElementRef<typeof View>,
    ViewProps &
        VariantProps<typeof alertVariants> & {
            icon: LucideIcon;
            iconSize?: number;
            iconClassName?: string;
        }
>(
    (
        {
            className,
            variant,
            children,
            icon: Icon,
            iconSize = 16,
            iconClassName: _,
            ...props
        },
        ref,
    ) => {
        const { colors } = useTheme();
        return (
            <View
                ref={ref}
                role="alert"
                className={alertVariants({ variant, className })}
                {...props}
            >
                <View className="absolute left-3.5 top-4 -translate-y-0.5">
                    <Icon
                        size={iconSize}
                        color={
                            variant === 'destructive'
                                ? colors.notification
                                : colors.text
                        }
                    />
                </View>
                {children}
            </View>
        );
    },
);
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<
    React.ElementRef<typeof Text>,
    React.ComponentPropsWithoutRef<typeof Text> &
        VariantProps<typeof alertTextVariants>
>(({ className, variant, ...props }, ref) => (
    <Text
        ref={ref}
        className={cn(alertTextVariants({ variant, className }), className)}
        {...props}
    />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
    React.ElementRef<typeof Text>,
    React.ComponentPropsWithoutRef<typeof Text> &
        VariantProps<typeof alertTextVariants>
>(({ className, variant, ...props }, ref) => (
    <Text
        ref={ref}
        className={cn(alertTextVariants({ variant, className }), className)}
        {...props}
    />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertDescription, AlertTitle };
