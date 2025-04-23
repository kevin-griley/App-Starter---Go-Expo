import { useOrganization } from '@/components/OrganizationProvider';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { H1 } from '@/components/ui/typography';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { Terminal } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';
import { OrgLayout } from '../layout';

const DashboardWithoutLayout = () => {
    const { organization, setOrganization } = useOrganization();

    return (
        <View className="flex-1">
            <View className="w-full flex-col gap-3">
                <H1>{organization?.name || 'No organization'}</H1>
                <Text>This your current organization.</Text>

                <Alert icon={Terminal} variant="destructive">
                    <AlertTitle variant="destructive">Organization</AlertTitle>
                    <AlertDescription
                        variant="destructive"
                        className="max-h-[50vh] overflow-auto"
                    >
                        {JSON.stringify(organization, null, 4)}
                    </AlertDescription>
                </Alert>

                <Button
                    className="max-w-xl"
                    onPress={async () => setOrganization(null)}
                >
                    <Text> Back to account </Text>
                </Button>
            </View>
        </View>
    );
};

export const Dashboard = () => {
    return (
        <OrgLayout>
            <DashboardWithoutLayout />
        </OrgLayout>
    );
};
