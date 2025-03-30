import * as React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const AppLayout = (props: AppLayoutProps) => {
    return (
        <SafeAreaView className="flex-1 justify-center items-center p-6 bg-secondary/30">
            <ScrollView
                className="w-full h-full"
                contentContainerStyle={{ flexGrow: 1 }}
            >
                {props.children}
            </ScrollView>
        </SafeAreaView>
    );
};
