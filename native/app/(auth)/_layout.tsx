import { LoadingScreen } from '@/components/LoadingScreen';
import { useSession } from '@/components/SessionProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { H4 } from '@/components/ui/typography';

import { Redirect, Stack } from 'expo-router';

export default function AppLayout() {
    const { session, isLoading } = useSession();

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (session) {
        console.log('Redirecting to dashboard from (auth) layout');

        return <Redirect href="/dashboard" />;
    }

    return (
        <Stack
            screenOptions={{
                headerTitle(props) {
                    return <H4>{toOptions(props.children)}</H4>;
                },
                headerRight: () => <ThemeToggle />,
            }}
        />
    );
}

function toOptions(name: string) {
    switch (name) {
        case 'index':
            return 'Welcome';

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
