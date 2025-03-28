import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Skeleton } from './ui/skeleton';

export const LoadingScreen = () => {
    return (
        <SafeAreaView className="flex-1 bg-background">
            <Animated.View entering={FadeIn}>
                <View className="flex-col gap-6 p-6 ">
                    <View className="flex-row items-center gap-3">
                        <Skeleton className="h-20 w-20 rounded-full" />
                        <View className="flex-1 gap-2">
                            <Skeleton className="w-full h-5" />
                            <Skeleton className="w-full h-5" />
                        </View>
                    </View>
                    <View className="gap-3">
                        <Skeleton className="h-44 w-full" />
                        <Skeleton className="w-full h-5" />
                        <Skeleton className="w-10/12 h-5" />
                        <Skeleton className="w-8/12 h-5" />
                    </View>
                    <View className="gap-3">
                        <Skeleton className="h-44 w-full" />
                        <Skeleton className="w-full h-5" />
                        <Skeleton className="w-10/12 h-5" />
                        <Skeleton className="w-8/12 h-5" />
                    </View>
                </View>
            </Animated.View>
        </SafeAreaView>
    );
};
