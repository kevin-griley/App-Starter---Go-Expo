import { cn } from '@/lib/utils';
import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';

const Input = React.forwardRef<
    React.ElementRef<typeof TextInput>,
    TextInputProps
>(({ className, placeholderClassName, ...props }, ref) => {
    return (
        <TextInput
            ref={ref}
            className={cn(
                'web:flex h-10 native:h-12 web:w-full rounded-base border-2 border-border bg-bw px-3 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-text placeholder:text-text font-serif web:ring-offset-white file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-black web:focus-visible:ring-offset-2',
                props.editable === false && 'opacity-50 web:cursor-not-allowed',
                className,
            )}
            placeholderClassName={cn(placeholderClassName)}
            {...props}
        />
    );
});

Input.displayName = 'Input';

export { Input };
