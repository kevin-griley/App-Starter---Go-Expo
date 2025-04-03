import { Text, TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type { TextRef, ViewRef } from '@rn-primitives/types';
import * as React from 'react';
import { type TextProps, View, type ViewProps } from 'react-native';
const Card = React.forwardRef<ViewRef, ViewProps>(
    ({ className, ...props }, ref) => (
        <View
            ref={ref}
            className={cn(
                'rounded-base border-2 border-border bg-main shadow-sm shadow-shadow',
                className,
            )}
            {...props}
        />
    ),
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<ViewRef, ViewProps>(
    ({ className, ...props }, ref) => (
        <View
            ref={ref}
            className={cn('flex flex-col space-y-1.5 p-6', className)}
            {...props}
        />
    ),
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<TextRef, TextProps>(
    ({ className, ...props }, ref) => (
        <Text
            role="heading"
            aria-level={3}
            ref={ref}
            className={cn(
                'text-2xl text-mtext font-semibold leading-none tracking-tight',
                className,
            )}
            {...props}
        />
    ),
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<TextRef, TextProps>(
    ({ className, ...props }, ref) => (
        <Text
            ref={ref}
            className={cn('text-sm text-mtext', className)}
            {...props}
        />
    ),
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<ViewRef, ViewProps>(
    ({ className, ...props }, ref) => (
        <TextClassContext.Provider value="text-mtext">
            <View ref={ref} className={cn('p-6 pt-0', className)} {...props} />
        </TextClassContext.Provider>
    ),
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<ViewRef, ViewProps>(
    ({ className, ...props }, ref) => (
        <View
            ref={ref}
            className={cn('flex flex-row items-center p-6 pt-0', className)}
            {...props}
        />
    ),
);
CardFooter.displayName = 'CardFooter';

export {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
};
