import { H2 } from '@/components/ui/typography';
import { View } from 'react-native';

export function Clients() {
    return (
        <View className="px-10 max-w-7xl self-center w-full">
            <View className="flex gap-x-8">
                <H2 className="text-white text-4xl sm:text-6xl font-medium font-serif">
                    The one platform powering every move.
                </H2>
            </View>
            <View>
                <View className="mt-10 flex flex-row gap-x-8 gap-y-10 ">
                    <H2 className="text-neutral-300 text-3xl sm:text-5xl font-light font-serif tracking-normal">
                        On the ground or in the sky, Track by unit or by fleet.
                        Scan, sync, and scale
                    </H2>
                </View>
            </View>
        </View>
    );
}
