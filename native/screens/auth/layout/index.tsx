import { VStack } from '@/components/ui/vstack';
import * as React from 'react';
import { ScrollView } from 'react-native';
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
                <VStack className="flex-1 p-9 md:items-center md:justify-center md:gap-10 md:m-auto md:w-1/2 ">
                    {props.children}
                </VStack>
            </ScrollView>
        </SafeAreaView>
    );
};
