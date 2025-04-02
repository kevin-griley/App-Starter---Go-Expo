import { H1 } from '@/components/ui/typography';
import { VStack } from '@/components/ui/vstack';
import * as React from 'react';
import { AppLayout } from '../layout';

const ProfileWithoutLayout = () => {
    return (
        <VStack className="flex-1 " space="md">
            <VStack className="w-full">
                <H1>My Profile</H1>
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
