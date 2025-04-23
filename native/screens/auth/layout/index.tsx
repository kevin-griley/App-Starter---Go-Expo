import * as React from 'react';
import { ScrollView, View } from 'react-native';

interface AuthLayoutProps {
    children: React.ReactNode;
}

export const AuthLayout = (props: AuthLayoutProps) => {
    return (
        <View className="flex-1 justify-center items-center bg-bg border-t-2 border-border">
            <ScrollView
                className="w-full h-full"
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="w-full h-full flex-grow justify-center flex-row">
                    <View className="relative hidden md:flex h-full w-full flex-1 items-center justify-center flex-col gap-4">
                        <View className="flex-1 w-full bg-gradient-to-br from-emerald-950 via-blue-950 to-indigo-950 ">
                            <View className="flex items-center justify-center h-full">
                                {/* Logo Goes Here */}
                            </View>
                        </View>
                    </View>

                    <View className="md:items-center md:justify-center flex-1 w-full p-9 md:gap-10 gap-16 md:m-auto md:w-1/2 h-full">
                        {props.children}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};
