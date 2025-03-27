import { Text } from '@/components/ui/text';
import '../global.css';

import { ThemeToggle } from '@/components/ThemeToggle';
import { setAndroidNavigationBar } from '@/lib/android-navigation-bar';
import { queryClient } from '@/lib/api/client';
import { NAV_THEME } from '@/lib/constants';
import { useColorScheme } from '@/lib/useColorScheme';
import {
    DarkTheme,
    DefaultTheme,
    type Theme,
    ThemeProvider,
} from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const LIGHT_THEME: Theme = {
    ...DefaultTheme,
    colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
    ...DarkTheme,
    colors: NAV_THEME.dark,
};

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const hasMounted = React.useRef(false);
    const { colorScheme, isDarkColorScheme } = useColorScheme();
    const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

    const [loaded, error] = useFonts({
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    React.useEffect(() => {
        if (error) throw error;
    }, [error]);

    React.useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    useIsomorphicLayoutEffect(() => {
        if (hasMounted.current) {
            return;
        }
        if (Platform.OS === 'web') {
            document.documentElement.classList.add('bg-background');
        }
        setAndroidNavigationBar(colorScheme);
        setIsColorSchemeLoaded(true);
        hasMounted.current = true;
    }, []);

    if (!isColorSchemeLoaded || !loaded) {
        return null;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
                <ThemeProvider
                    value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}
                >
                    <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
                    <Stack
                        screenOptions={{
                            headerBackTitle: 'Back',
                            headerTitle(props) {
                                return (
                                    <Text className="text-xl font-semibold">
                                        {toOptions(props.children)}
                                    </Text>
                                );
                            },
                            headerRight: () => <ThemeToggle />,
                        }}
                    />
                    <PortalHost />
                </ThemeProvider>
            </SafeAreaProvider>
        </QueryClientProvider>
    );
}

const useIsomorphicLayoutEffect =
    Platform.OS === 'web' && typeof window === 'undefined'
        ? React.useEffect
        : React.useLayoutEffect;

function toOptions(name: string) {
    const title = name
        .split('/')
        .flatMap((str) => str.split('-'))
        .map(function (str: string) {
            return str.replace(/\b\w/g, function (char) {
                return char.toUpperCase();
            });
        })
        .join(' ');
    return title === 'index' ? 'Home' : title;
}
