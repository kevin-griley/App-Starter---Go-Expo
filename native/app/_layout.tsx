import '../global.css';

import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import * as React from 'react';
import { NAV_THEME } from '@/lib/constants';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/api/client';
import {
    DarkTheme,
    DefaultTheme,
    type Theme,
    ThemeProvider,
} from '@react-navigation/native';
import { useColorScheme } from '@/lib/useColorScheme';
import { setAndroidNavigationBar } from '@/lib/android-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import { PortalHost } from '@rn-primitives/portal';

const LIGHT_THEME: Theme = {
    ...DefaultTheme,
    colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
    ...DarkTheme,
    colors: NAV_THEME.dark,
};

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
    const hasMounted = React.useRef(false);
    const { colorScheme, isDarkColorScheme } = useColorScheme();
    const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

    useIsomorphicLayoutEffect(() => {
        if (hasMounted.current) {
            return;
        }

        if (Platform.OS === 'web') {
            // Adds the background color to the html element to prevent white background on overscroll.
            document.documentElement.classList.add('bg-background');
        }
        setAndroidNavigationBar(colorScheme);
        setIsColorSchemeLoaded(true);
        hasMounted.current = true;
    }, []);

    if (!isColorSchemeLoaded) {
        return null;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
                <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
                <Stack />
                <PortalHost />
            </ThemeProvider>
        </QueryClientProvider>
    );
}

const useIsomorphicLayoutEffect =
    Platform.OS === 'web' && typeof window === 'undefined'
        ? React.useEffect
        : React.useLayoutEffect;
