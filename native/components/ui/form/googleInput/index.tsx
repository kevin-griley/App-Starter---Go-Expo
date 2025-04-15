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
} from '../';

import { BASE_URL } from '@/lib/api/client';
import { useColorScheme } from '@/lib/useColorScheme';
import { Image, View } from 'react-native';
import { Input } from '../../input';
import type { GooglePlaceAddress } from './schema';
import { GooglePlaceAddressSchema } from './schema';

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

    React.useEffect(() => {
        inputRef.current?.setAddressText(props.value.formatted_address ?? '');
    }, []);

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
                }}
                query={query}
                requestUrl={{
                    useOnPlatform: 'all',
                    url: BASE_URL + '/proxy',
                }}
                onPress={(_, details) => {
                    if (!details) return;
                    const parsedDetails =
                        GooglePlaceAddressSchema.parse(details);
                    onChange(parsedDetails);
                }}
                fetchDetails
                disableScroll
                suppressDefaultStyles
                enablePoweredByContainer={false}
                styles={STYLES}
                listHoverColor="rgba(250, 250, 250, 0.2)"
                {...props}
            />

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

const STYLES: Partial<Styles> = {
    listView: {
        backgroundColor: '#88aaee',
        borderTopColor: '#000000',
        borderBottomColor: '#000000',
        borderLeftColor: '#000000',
        borderRightColor: '#000000',
        borderWidth: 2,
        borderRadius: 5,
    },
    row: {
        borderRadius: 5,
        padding: 12,
        height: 42,
        flexDirection: 'row',
    },
    separator: {
        height: 2,
        backgroundColor: '#000000',
    },
    description: {
        color: '#000000',
        fontFamily: 'RedHatText',
    },
    loader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: 20,
    },
};
