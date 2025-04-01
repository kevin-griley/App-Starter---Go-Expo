import * as React from 'react';
import { ScrollView, View } from 'react-native';

interface OrgLayoutProps {
    children: React.ReactNode;
}

export const OrgLayout = (props: OrgLayoutProps) => {
    return (
        <View className="flex-1 justify-center items-center p-6 bg-secondary/30">
            <ScrollView
                className="w-full h-full"
                contentContainerStyle={{ flexGrow: 1 }}
            >
                {props.children}
            </ScrollView>
        </View>
    );
};
