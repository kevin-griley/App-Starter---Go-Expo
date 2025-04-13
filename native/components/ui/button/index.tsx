import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Pressable } from 'react-native';

const buttonVariants = cva(
    'group flex items-center justify-center rounded-base web:ring-offset-white web:transition-all web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-black web:focus-visible:ring-offset-2',
    {
        variants: {
            variant: {
                default:
                    'bg-main border-2 border-border shadow-shadow web:hover:translate-y-boxShadowY web:hover:shadow-none',
                noShadow: 'bg-main border-2 border-border',
                neutral:
                    'bg-bw border-2 border-border shadow-shadow web:hover:translate-y-boxShadowY web:hover:shadow-none',
                reverse:
                    'bg-main border-2 border-border web:hover:translate-x-reverseBoxShadowX web:hover:translate-y-reverseBoxShadowY web:hover:shadow-shadow',
            },
            size: {
                default: 'h-10 px-4 py-2 native:h-12 native:px-5 native:py-3',
                sm: 'h-9 px-3',
                lg: 'h-11 px-8 native:h-14',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

const buttonTextVariants = cva(
    'web:whitespace-nowrap text-sm native:text-base font-medium web:transition-colors',
    {
        variants: {
            variant: {
                default: 'text-mtext',
                noShadow: 'text-mtext',
                neutral: 'text-text',
                reverse: 'text-mtext',
            },
            size: {
                default: '',
                sm: '',
                lg: 'native:text-lg',
                icon: '',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
    VariantProps<typeof buttonVariants>;

const Button = React.forwardRef<
    React.ElementRef<typeof Pressable>,
    ButtonProps
>(({ className, variant, size, ...props }, ref) => {
    return (
        <TextClassContext.Provider
            value={buttonTextVariants({
                variant,
                size,
                className: 'web:pointer-events-none',
            })}
        >
            <Pressable
                className={cn(
                    props.disabled && 'opacity-50 web:pointer-events-none',
                    buttonVariants({ variant, size, className }),
                )}
                ref={ref}
                role="button"
                {...props}
            />
        </TextClassContext.Provider>
    );
});
Button.displayName = 'Button';

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
