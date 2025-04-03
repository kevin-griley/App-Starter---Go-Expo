import { useOrganization } from '@/components/OrganizationProvider';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { H1 } from '@/components/ui/typography';
import { VStack } from '@/components/ui/vstack';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { Terminal } from 'lucide-react-native';
import * as React from 'react';
import { OrgLayout } from '../layout';

const DashboardWithoutLayout = () => {
    const { organization, setOrganization } = useOrganization();

    return (
        <VStack className="flex-1 " space="md">
            <VStack className="w-full">
                <H1>{organization?.name || 'No organization'}</H1>
                <Text>This your current organization.</Text>

                <Alert icon={Terminal} variant="destructive">
                    <AlertTitle variant="destructive">Organization</AlertTitle>
                    <AlertDescription variant="destructive">
                        {JSON.stringify(organization, null, 2)}
                    </AlertDescription>
                </Alert>

                <Button
                    className="max-w-xl"
                    onPress={async () => setOrganization(null)}
                >
                    <Text> Back to account </Text>
                </Button>
            </VStack>
        </VStack>
    );
};

export const Dashboard = () => {
    return (
        <OrgLayout>
            <DashboardWithoutLayout />
        </OrgLayout>
    );
};
