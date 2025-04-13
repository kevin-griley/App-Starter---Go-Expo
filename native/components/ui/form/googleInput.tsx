import * as React from 'react';
import type { Noop } from 'react-hook-form';

import type {
    AutocompleteRequestType,
    GooglePlacesAutocompleteRef,
    Query,
    Styles,
} from 'react-native-google-places-autocomplete';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {
    FormDescription,
    FormItem,
    FormLabel,
    FormMessage,
    useFormField,
} from '.';

import { useColorScheme } from '@/lib/useColorScheme';
import { Image, ScrollView, View } from 'react-native';
import { z } from 'zod';
import { Input } from '../input';

type Override<T, U> = Omit<T, keyof U> & U;

interface FormFieldFieldProps<T> {
    name: string;
    onBlur: Noop;
    onChange: (val: T) => void;
    value: T;
    disabled?: boolean;
    query?: Query<AutocompleteRequestType>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormItemProps<T extends React.ElementType<any>, U> = Override<
    React.ComponentPropsWithoutRef<T>,
    FormFieldFieldProps<U>
> & {
    label?: string;
};

export const GoogleInput = React.forwardRef<
    GooglePlacesAutocompleteRef,
    FormItemProps<typeof GooglePlacesAutocomplete, GooglePlaceAddress>
>(({ label, onChange, query = {}, ...props }, ref) => {
    const { isDarkColorScheme } = useColorScheme();
    const inputRef = React.useRef<GooglePlacesAutocompleteRef | null>(null);

    const {
        error,
        formItemNativeID,
        formDescriptionNativeID,
        formMessageNativeID,
    } = useFormField();

    React.useImperativeHandle(ref, () => {
        if (!inputRef.current) {
            return {} as React.ComponentRef<typeof GooglePlacesAutocomplete>;
        }
        return inputRef.current;
    }, [inputRef.current]);

    function handleOnLabelPress() {
        if (!inputRef.current) {
            return;
        }
        if (inputRef.current.isFocused()) {
            inputRef.current?.blur();
        } else {
            inputRef.current?.focus();
        }
    }

    const styles = React.useMemo<Partial<Styles>>(
        () => ({
            container: {
                flex: 1,
            },
            listView: {
                backgroundColor: isDarkColorScheme ? '#212121' : '#FFFFFF',
                borderTopColor: '#000000',
                borderBottomColor: '#000000',
                borderLeftColor: '#000000',
                borderRightColor: '#000000',
                borderWidth: 2,
                borderRadius: 5,
            },
            row: {
                borderRadius: 5,
                padding: 13,
                height: 44,
                flexDirection: 'row',
            },
            separator: {
                height: 2,
                backgroundColor: '#000000',
            },
            description: {
                color: isDarkColorScheme ? '#FFFFFF' : '#000000',
                fontFamily: 'RedHatText',
            },
            loader: {
                flexDirection: 'row',
                justifyContent: 'flex-end',
                height: 20,
            },
        }),
        [isDarkColorScheme],
    );

    return (
        <FormItem className="space-y-0">
            {!!label && (
                <FormLabel
                    nativeID={formItemNativeID}
                    onPress={handleOnLabelPress}
                    className="mb-2"
                >
                    {label}
                </FormLabel>
            )}
            <ScrollView
                horizontal
                scrollEnabled={false}
                style={{ flex: 1, width: '100%', height: '100%' }}
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <GooglePlacesAutocomplete
                    ref={inputRef}
                    aria-labelledby={formItemNativeID}
                    aria-describedby={
                        !error
                            ? `${formDescriptionNativeID}`
                            : `${formDescriptionNativeID} ${formMessageNativeID}`
                    }
                    aria-invalid={!!error}
                    textInputProps={{
                        InputComp: Input,
                        className: 'bg-bw',
                    }}
                    fetchDetails
                    query={query}
                    requestUrl={{
                        useOnPlatform: 'all',
                        url: 'http://localhost/proxy',
                    }}
                    onPress={(_, details) => {
                        if (!details) return;

                        const parsedDetails =
                            GooglePlaceAddressSchema.parse(details);

                        onChange(parsedDetails);
                    }}
                    suppressDefaultStyles
                    enablePoweredByContainer={false}
                    styles={styles}
                    listHoverColor={isDarkColorScheme ? '#212121' : '#FFFFFF'}
                    {...props}
                />
            </ScrollView>

            {!error ? (
                <View className="flex flex-row justify-end items-end gap-x-2 mr-2">
                    <FormDescription>Powered by</FormDescription>
                    <Image
                        alt="google-logo"
                        style={{
                            width: 60,
                            height: 20,
                            resizeMode: 'contain',
                        }}
                        source={
                            isDarkColorScheme
                                ? // eslint-disable-next-line @typescript-eslint/no-require-imports
                                  require('@/assets/logos/google_on_non_white.png')
                                : // eslint-disable-next-line @typescript-eslint/no-require-imports
                                  require('@/assets/logos/google_on_white.png')
                        }
                    />
                </View>
            ) : (
                <FormMessage />
            )}
        </FormItem>
    );
});
GoogleInput.displayName = 'GoogleInput';

const GooglePlaceAddressSchema = z.object({
    formatted_address: z.string(),
    formatted_phone_number: z.string().optional(),
    place_id: z.string(),
    name: z.string().optional(),
    types: z.array(z.string()).optional(),
    geometry: z
        .object({
            location: z.object({
                lat: z.number(),
                lng: z.number(),
            }),
        })
        .optional(),
    utc_offset: z.number().optional(),
    address_components: z
        .array(
            z.object({
                long_name: z.string(),
                short_name: z.string(),
                types: z.array(z.string()),
            }),
        )
        .optional(),
    current_opening_hours: z
        .object({
            weekday_text: z.array(z.string()),
        })
        .optional(),
});

export type GooglePlaceAddress = z.infer<typeof GooglePlaceAddressSchema>;
