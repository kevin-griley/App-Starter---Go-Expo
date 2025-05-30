import { cn } from '@/lib/utils';
import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';

const Textarea = React.forwardRef<
    React.ElementRef<typeof TextInput>,
    TextInputProps
>(
    (
        {
            className,
            multiline = true,
            numberOfLines = 4,
            placeholderClassName,
            ...props
        },
        ref,
    ) => {
        return (
            <TextInput
                ref={ref}
                className={cn(
                    'web:flex min-h-[80px] w-full rounded-base border-2 border-border bg-bw px-3 py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-text font-serif web:ring-offset-white web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-black web:focus-visible:ring-offset-2',
                    props.editable === false &&
                        'opacity-50 web:cursor-not-allowed',
                    className,
                )}
                placeholderClassName={cn('text-text', placeholderClassName)}
                multiline={multiline}
                numberOfLines={numberOfLines}
                textAlignVertical="top"
                {...props}
            />
        );
    },
);

Textarea.displayName = 'Textarea';

export { Textarea };
