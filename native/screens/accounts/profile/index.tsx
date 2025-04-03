import { useSession } from '@/components/SessionProvider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Text } from '@/components/ui/text';
import { H1 } from '@/components/ui/typography';
import { VStack } from '@/components/ui/vstack';
import { Terminal } from 'lucide-react-native';
import * as React from 'react';
import { AppLayout } from '../layout';

const ProfileWithoutLayout = () => {
    const { session } = useSession();

    return (
        <VStack className="flex-1 " space="md">
            <VStack className="w-full">
                <H1>My Profile</H1>
                <Text>This your current user.</Text>
                <Alert icon={Terminal} variant="destructive">
                    <AlertTitle variant="destructive">Session</AlertTitle>
                    <AlertDescription variant="destructive">
                        {JSON.stringify(session, null, 2)}
                    </AlertDescription>
                </Alert>
            </VStack>
        </VStack>
    );
};

export const Profile = () => {
    return (
        <AppLayout>
            <ProfileWithoutLayout />
        </AppLayout>
    );
};
