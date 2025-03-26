import * as React from 'react';

import { ThemeToggle } from '@/components/ThemeToggle';
import { SplashScreen } from '@/screens/auth/splash-screen';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native';

export default function Index() {
    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Welcome to **Company**',
                    headerRight: () => <ThemeToggle />,
                }}
            />
            <SafeAreaView className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
                <SplashScreen />
            </SafeAreaView>
        </>
    );
}
