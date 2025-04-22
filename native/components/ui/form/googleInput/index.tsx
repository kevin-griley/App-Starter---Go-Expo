import * as React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Option } from '../../select';
import {
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
} from '../../select';

import { BASE_URL } from '@/lib/api/client';
import { useColorScheme } from '@/lib/useColorScheme';

import { ActivityIndicator, Image, View } from 'react-native';
import type { FormItemProps } from '..';
import { FormSelect } from '..';
import { Input } from '../../input';
import { Text } from '../../text';
import { GooglePlaceAddressSchema } from './schema';
import { useGooglePlacesAutocomplete } from './useGooglePlaces';
import { AddressWrapper } from './wrapper';

export const GoogleInput = React.forwardRef<
    React.ElementRef<typeof FormSelect>,
    FormItemProps<typeof FormSelect, Partial<Option>>
>(({ onChange, ...rest }, ref) => {
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

    const { input, suggestions, loading, onChangeText, selectPlace } =
        useGooglePlacesAutocomplete({
            proxyUrl: BASE_URL + '/proxy',
        });

    const focusInput = React.useCallback(() => {
        setTimeout(() => {
            inputRef?.current?.focus();
        }, 0);
    }, [inputRef]);

    React.useEffect(focusInput, [suggestions]);

    const address = new AddressWrapper(rest.value);

    return (
        <FormSelect
            ref={ref}
            onChange={async (val) => {
                const result = suggestions.find(
                    (place) => place.place_id === val?.value,
                );
                if (!result) return;
                const detail = await selectPlace(result);
                if (!detail) return;
                const parsed = GooglePlaceAddressSchema.parse(detail);
                onChange(parsed as unknown as Option);
            }}
            {...rest}
        >
            <SelectTrigger
                onLayout={(ev) => {
                    setSelectTriggerWidth(ev.nativeEvent.layout.width);
                }}
                onPress={focusInput}
            >
                {address.isValid()
                    ? address.getFormattedAddress()
                    : 'Select address...'}
            </SelectTrigger>

            <SelectContent
                insets={contentInsets}
                style={{ width: selectTriggerWidth }}
            >
                <Input
                    key="google-input"
                    className="web:focus-visible:ring-bw native:m-1"
                    ref={inputRef}
                    placeholder="Search for address..."
                    value={input}
                    onChangeText={onChangeText}
                    autoFocus
                />
                <View className="border-b-2 border-border h-px my-1" />
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
                <View className="border-b-2 border-border h-px my-1" />
                <View className="flex flex-row justify-end items-end gap-x-2 mr-2 p-1">
                    <Text className="text-sm text-text opacity-70">
                        Powered by
                    </Text>
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
