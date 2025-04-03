import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import * as TabsPrimitive from '@rn-primitives/tabs';
import * as React from 'react';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
    TabsPrimitive.ListRef,
    TabsPrimitive.ListProps
>(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn(
            'web:inline-flex h-10 native:h-12 items-center justify-center rounded-base border-2 border-border bg-main p-1 native:px-1.5',
            className,
        )}
        {...props}
    />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
    TabsPrimitive.TriggerRef,
    TabsPrimitive.TriggerProps
>(({ className, ...props }, ref) => {
    const { value } = TabsPrimitive.useRootContext();
    return (
        <TextClassContext.Provider
            value={cn(
                'text-sm native:text-base font-medium text-mtext web:transition-all',
                value === props.value && 'text-mtext',
            )}
        >
            <TabsPrimitive.Trigger
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center shadow-none web:whitespace-nowrap rounded-base border-2 border-transparent px-3 py-1 text-sm font-medium web:ring-offset-white web:transition-all web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-black web:focus-visible:ring-offset-2',
                    props.disabled && 'web:pointer-events-none opacity-50',
                    props.value === value && 'border-border',
                    className,
                )}
                {...props}
            />
        </TextClassContext.Provider>
    );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
    TabsPrimitive.ContentRef,
    TabsPrimitive.ContentProps
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn(
            'mt-0.5 web:ring-offset-white web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-black web:focus-visible:ring-offset-2',
            className,
        )}
        {...props}
    />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
