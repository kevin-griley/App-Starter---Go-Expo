import * as React from 'react';

import { BackLink } from '@/components/BackLink';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SignIn } from '@/screens/auth/sign-in';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native';

export default function Index() {
    return (
        <>
            <Stack.Screen
                options={{
                    headerLeft: () => <BackLink link="/" />,
                    headerTitle: 'Sign In',
                    headerRight: () => <ThemeToggle />,
                }}
            />
            <SafeAreaView className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
                <SignIn />
            </SafeAreaView>
        </>
    );
}
