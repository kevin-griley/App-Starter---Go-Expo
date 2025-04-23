import '../global.css';

import { OrganizationProvider } from '@/components/OrganizationProvider';
import 'react-native-get-random-values';

import { ModalProvider } from '@/components/ModalManager/context';
import { SessionProvider } from '@/components/SessionProvider';
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
import { Slot } from 'expo-router';
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
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        RedHatText: require('../assets/fonts/RedHatText-VariableFont_wght.ttf'),
    });

    React.useEffect(() => {
        if (error) throw error;
    }, [error]);

    useIsomorphicLayoutEffect(() => {
        if (hasMounted.current) {
            return;
        }
        if (Platform.OS === 'web') {
            document.documentElement.classList.add('bg-bg');
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
            <SessionProvider>
                <OrganizationProvider>
                    <SafeAreaProvider>
                        <ModalProvider>
                            <ThemeProvider
                                value={
                                    isDarkColorScheme ? DARK_THEME : LIGHT_THEME
                                }
                            >
                                <StatusBar
                                    style={isDarkColorScheme ? 'light' : 'dark'}
                                />
                                <Slot />
                                <PortalHost />
                            </ThemeProvider>
                        </ModalProvider>
                    </SafeAreaProvider>
                </OrganizationProvider>
            </SessionProvider>
        </QueryClientProvider>
    );
}

const useIsomorphicLayoutEffect =
    Platform.OS === 'web' && typeof window === 'undefined'
        ? React.useEffect
        : React.useLayoutEffect;
