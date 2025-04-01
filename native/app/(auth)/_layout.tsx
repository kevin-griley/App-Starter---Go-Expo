import { useSession } from '@/components/SessionProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { H4 } from '@/components/ui/typography';

import { Redirect, Stack } from 'expo-router';

export default function AuthRootLayout() {
    const { session } = useSession();

    if (session) {
        return <Redirect href="/my-account" />;
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
