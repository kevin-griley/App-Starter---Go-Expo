import { LoadingScreen } from '@/components/LoadingScreen';
import { useSession } from '@/components/SessionProvider';
import { Redirect } from 'expo-router';
import { Drawer } from 'expo-router/drawer';

import { CustomDrawerContent } from '@/components/Drawer/account';
import { GestureRootView } from '@/components/GestureRoot/View';
import { useOrganization } from '@/components/OrganizationProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { H4 } from '@/components/ui/typography';

export default function AppRootLayout() {
    const { session, isLoading } = useSession();
    const { organization, init } = useOrganization();

    if (isLoading || !init) {
        return <LoadingScreen />;
    }

    if (!session) {
        return <Redirect href="/" />;
    }

    if (organization) {
        return <Redirect href="/dispatch" />;
    }

    return (
        <GestureRootView>
            <Drawer
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={{
                    headerTitle(props) {
                        return <H4>{toOptions(props.children)}</H4>;
                    },
                    headerRight: () => <ThemeToggle />,
                    headerShadowVisible: false,
                }}
            />
        </GestureRootView>
    );
}

function toOptions(name: string) {
    switch (name) {
        case 'index':
            return 'My Account';

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
