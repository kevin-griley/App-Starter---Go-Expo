import * as React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { FormItemProps } from '..';
import { FormDescription, FormSelect } from '..';
import type { Option, Select } from '../../select';
import {
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../select';

import { BASE_URL } from '@/lib/api/client';
import { useColorScheme } from '@/lib/useColorScheme';
import { ActivityIndicator, Image, View } from 'react-native';
import { DropdownMenuSeparator } from '../../dropdown-menu';
import { Input } from '../../input';
import { Text } from '../../text';
import { useGooglePlacesAutocomplete } from './useGooglePlaces';

export const GoogleTest = React.forwardRef<
    React.ElementRef<typeof Select>,
    Omit<
        FormItemProps<typeof Select, Partial<Option>>,
        'open' | 'onOpenChange' | 'onValueChange'
    >
>((props, ref) => {
    const { isDarkColorScheme } = useColorScheme();

    const [selectTriggerWidth, setSelectTriggerWidth] = React.useState(0);

    const insets = useSafeAreaInsets();

    const contentInsets = {
        top: insets.top,
        bottom: insets.bottom,
        left: 12,
        right: 12,
    };

    const inputRef = React.useRef<React.ElementRef<typeof Input>>(null);

    const { input, suggestions, loading, onChangeText } =
        useGooglePlacesAutocomplete({
            ref: inputRef,
            proxyUrl: BASE_URL + '/proxy',
        });

    React.useEffect(() => {
        setTimeout(() => {
            inputRef?.current?.focus();
        }, 0);
    }, [suggestions]);

    return (
        <FormSelect {...props} ref={ref}>
            <SelectTrigger
                onLayout={(ev) => {
                    setSelectTriggerWidth(ev.nativeEvent.layout.width);
                }}
                onPress={() => {
                    inputRef.current?.focus();
                }}
            >
                <SelectValue placeholder="Select address..." />
            </SelectTrigger>

            <SelectContent
                insets={contentInsets}
                style={{ width: selectTriggerWidth }}
            >
                <Input
                    key="google-input"
                    className="flex-grow web:focus-visible:ring-bw"
                    ref={inputRef}
                    placeholder="Search for address..."
                    value={input}
                    onChangeText={onChangeText}
                />

                <DropdownMenuSeparator />

                {loading && <ActivityIndicator size="large" />}

                <SelectGroup>
                    {suggestions.length > 0 ? (
                        suggestions.map((place) => (
                            <SelectItem
                                key={place.place_id}
                                label={place.description}
                                value={place.place_id}
                            >
                                <Text>{place.description}</Text>
                            </SelectItem>
                        ))
                    ) : (
                        <SelectItem
                            key="no-results"
                            label="No results found"
                            value="no-results"
                            disabled
                        >
                            <Text>No results found</Text>
                        </SelectItem>
                    )}
                </SelectGroup>

                <DropdownMenuSeparator />

                <View className="flex flex-row justify-end items-end gap-x-2 mr-2 p-1">
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
            </SelectContent>
        </FormSelect>
    );
});
