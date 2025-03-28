import { LoadingScreen } from '@/components/LoadingScreen';
import { useSession } from '@/components/SessionProvider';

import { Redirect, Stack } from 'expo-router';

export default function AppLayout() {
    const { session, isLoading } = useSession();

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (session) {
        return <Redirect href="/dashboard" />;
    }

    return <Stack />;
}
