import * as React from 'react';
import { ScrollView, View } from 'react-native';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const AppLayout = (props: AppLayoutProps) => {
    return (
        <View className="flex-1 justify-center items-center p-6 bg-bg border-t-2 border-border">
            <ScrollView
                className="w-full h-full"
                contentContainerStyle={{ flexGrow: 1 }}
            >
                {props.children}
            </ScrollView>
        </View>
    );
};
