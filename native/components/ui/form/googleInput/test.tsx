import * as React from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FormSelect } from '..';
import {
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../select';
import { Text } from '../../text';

const emails = [
    { value: 'tom@cruise.com', label: 'tom@cruise.com' },
    { value: 'napoleon@dynamite.com', label: 'napoleon@dynamite.com' },
    { value: 'kunfu@panda.com', label: 'kunfu@panda.com' },
    { value: 'bruce@lee.com', label: 'bruce@lee.com' },
    { value: 'harry@potter.com', label: 'harry@potter.com' },
    { value: 'jane@doe.com', label: 'jane@doe.com' },
    { value: 'elon@musk.com', label: 'elon@musk.com' },
    { value: 'lara@croft.com', label: 'lara@croft.com' },
];

interface GoogleInputProps {
    field: ControllerRenderProps<any, any>;
}

export const GoogleTest: React.FC<GoogleInputProps> = ({ field }) => {
    const [selectTriggerWidth, setSelectTriggerWidth] = React.useState(0);

    const insets = useSafeAreaInsets();

    const contentInsets = {
        top: insets.top,
        bottom: insets.bottom,
        left: 12,
        right: 12,
    };

    return (
        <FormSelect {...field}>
            <SelectTrigger
                onLayout={(ev) => {
                    setSelectTriggerWidth(ev.nativeEvent.layout.width);
                }}
            >
                <SelectValue
                    className="text-mtext"
                    placeholder="Select a verified email"
                />
            </SelectTrigger>
            <SelectContent
                insets={contentInsets}
                style={{ width: selectTriggerWidth }}
            >
                <SelectGroup>
                    {emails.map((email) => (
                        <SelectItem
                            key={email.value}
                            label={email.label}
                            value={email.value}
                        >
                            <Text>{email.label}</Text>
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </FormSelect>
    );
};
