import { LoadingScreen } from '@/components/LoadingScreen';
import { useSession } from '@/components/SessionProvider';
import { Redirect } from 'expo-router';
import { Drawer } from 'expo-router/drawer';

import { CustomDrawerContent } from '@/components/Drawer';
import { GestureRootView } from '@/components/GestureRoot/View';
import { ThemeToggle } from '@/components/ThemeToggle';
import { H4 } from '@/components/ui/typography';

export default function AppRootLayout() {
    const { session, isLoading } = useSession();

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!session) {
        return <Redirect href="/" />;
    }

    return (
        <GestureRootView>
            <Drawer
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={{
                    drawerHideStatusBarOnOpen: true,
                    headerTitle(props) {
                        return <H4>{toOptions(props.children)}</H4>;
                    },
                    headerRight: () => <ThemeToggle />,
                }}
            />
        </GestureRootView>
    );
}

function toOptions(name: string) {
    switch (name) {
        default: {
            const title = name
                .split('-')
                .map(function (str: string) {
                    return str.replace(/\b\w/g, function (char) {
                        return char.toUpperCase();
                    });
                })
                .join(' ');
            return title;
        }
    }
}
