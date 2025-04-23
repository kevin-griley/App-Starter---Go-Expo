import { useSession } from '@/components/SessionProvider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Text } from '@/components/ui/text';
import { H1 } from '@/components/ui/typography';
import { Terminal } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';
import { AppLayout } from '../layout';

const ProfileWithoutLayout = () => {
    const { session } = useSession();

    return (
        <View className="flex-1">
            <View className="w-full flex-col gap-3">
                <H1>My Profile</H1>
                <Text>This your current user.</Text>
                <Alert icon={Terminal} variant="destructive">
                    <AlertTitle variant="destructive">Session</AlertTitle>
                    <AlertDescription variant="destructive">
                        {JSON.stringify(session, null, 2)}
                    </AlertDescription>
                </Alert>
            </View>
        </View>
    );
};

export const Profile = () => {
    return (
        <AppLayout>
            <ProfileWithoutLayout />
        </AppLayout>
    );
};
