import { ChevronsDownUp } from '@/lib/icons/ChevronsDownUp';
import { ChevronsUpDown } from '@/lib/icons/ChevronsUpDown';
import * as React from 'react';
import { Platform, Text, View } from 'react-native';
import Animated, {
    FadeInDown,
    LinearTransition,
} from 'react-native-reanimated';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '.';
import { Button } from '../button';

interface CollapsibleItemProps {
    label: string;
    items: string[];
}

export const CollapsibleDefault: React.FC<CollapsibleItemProps> = ({
    label,
    items,
}) => {
    const [open, setOpen] = React.useState(false);
    const firstItem = items[0];
    const restItems = items.slice(1);
    return (
        <View className="flex-1 justify-center items-center p-6">
            <Collapsible asChild open={open} onOpenChange={setOpen}>
                <Animated.View
                    layout={
                        Platform.OS !== 'web' ? LinearTransition : undefined
                    }
                >
                    <View className="w-full max-w-[350px] gap-2">
                        <View className="flex flex-row items-center justify-between space-x-4 px-4">
                            <Text className="text-foreground text-sm native:text-lg font-semibold">
                                {label}
                            </Text>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    {open ? (
                                        <ChevronsDownUp
                                            size={16}
                                            className="text-foreground"
                                        />
                                    ) : (
                                        <ChevronsUpDown
                                            size={16}
                                            className="text-foreground"
                                        />
                                    )}
                                    <Text className="sr-only">Toggle</Text>
                                </Button>
                            </CollapsibleTrigger>
                        </View>
                        <View className="rounded-md border border-border px-4 py-3 ">
                            <Text className="text-foreground text-sm native:text-lg">
                                {firstItem}
                            </Text>
                        </View>
                        <CollapsibleContent className="gap-2">
                            {restItems.map((item, index) => (
                                <CollapsibleItem key={index} delay={100}>
                                    {item}
                                </CollapsibleItem>
                            ))}
                        </CollapsibleContent>
                    </View>
                </Animated.View>
            </Collapsible>
        </View>
    );
};

function CollapsibleItem({
    children,
    delay,
}: {
    children: string;
    delay: number;
}) {
    if (Platform.OS === 'web') {
        return (
            <View className="rounded-md border border-border px-4 py-3">
                <Text className="text-foreground text-sm">{children}</Text>
            </View>
        );
    }

    return (
        <Animated.View
            entering={FadeInDown.duration(200).delay(delay)}
            className="rounded-md border border-border px-4 py-3"
        >
            <Text className="text-foreground text-lg">{children}</Text>
        </Animated.View>
    );
}
