import { useSession } from '@/components/SessionProvider';
import { Redirect, Stack } from 'expo-router';
import { Text } from 'react-native';

export default function AppLayout() {
    const { session, isLoading } = useSession();

    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    if (session) {
        return <Redirect href="/dashboard" />;
    }

    return <Stack />;
}
