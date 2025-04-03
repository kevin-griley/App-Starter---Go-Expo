import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import * as Slot from '@rn-primitives/slot';
import type { SlottableViewProps } from '@rn-primitives/types';
import { cva, type VariantProps } from 'class-variance-authority';
import { View } from 'react-native';
const badgeVariants = cva(
    'web:inline-flex items-center rounded-base border-2 border-border px-2.5 py-0.5 web:transition-colors web:focus:outline-none web:focus:ring-2 web:focus:ring-ring web:focus:ring-offset-2',
    {
        variants: {
            variant: {
                default: 'bg-main',
                neutral: 'bg-bw',
                warn: 'bg-warn',
                success: 'bg-success',
                error: 'bg-error',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

const badgeTextVariants = cva('text-xs font-semibold ', {
    variants: {
        variant: {
            default: 'text-mtext',
            neutral: 'text-text',
            warn: 'text-mtext',
            success: 'text-mtext',
            error: 'text-mtext',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

type BadgeProps = SlottableViewProps & VariantProps<typeof badgeVariants>;

function Badge({ className, variant, asChild, ...props }: BadgeProps) {
    const Component = asChild ? Slot.View : View;
    return (
        <TextClassContext.Provider value={badgeTextVariants({ variant })}>
            <Component
                className={cn(badgeVariants({ variant }), className)}
                {...props}
            />
        </TextClassContext.Provider>
    );
}

export { Badge, badgeTextVariants, badgeVariants };
export type { BadgeProps };
