import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import * as React from 'react';
import { Image, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AuthLayoutProps {
    children: React.ReactNode;
}

export const AuthLayout = (props: AuthLayoutProps) => {
    return (
        <SafeAreaView className="w-full h-full">
            <ScrollView
                className="w-full h-full"
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <HStack className="w-full h-full bg-background-0 flex-grow justify-center">
                    <VStack
                        className="relative hidden md:flex h-full w-full flex-1 items-center  justify-center"
                        space="md"
                    >
                        <View className="flex-1 w-full bg-gradient-to-br from-green-900 via-slate-950 to-emerald-900 rounded-md">
                            <View className="flex items-center justify-center h-full">
                                <Image
                                    // eslint-disable-next-line @typescript-eslint/no-require-imports
                                    source={require('@/assets/logos/MyCartage-icon.png')}
                                    className="h-64 w-64 max-w-full"
                                    // @ts-expect-error Web style
                                    style={
                                        Platform.OS === 'web'
                                            ? {
                                                  height: 'revert-layer',
                                                  width: 'revert-layer',
                                              }
                                            : undefined
                                    }
                                />
                            </View>
                        </View>
                    </VStack>

                    <VStack className="md:items-center md:justify-center flex-1 w-full  p-9 md:gap-10 gap-16 md:m-auto md:w-1/2 h-full">
                        {props.children}
                    </VStack>
                </HStack>
            </ScrollView>
        </SafeAreaView>
    );
};
