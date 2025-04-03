import { Text } from '@/components/ui/text';
import { H1 } from '@/components/ui/typography';
import { VStack } from '@/components/ui/vstack';
import { $api } from '@/lib/api/client';
import * as React from 'react';
import { AppLayout } from '../layout';
import { TenantSelector } from './tenant-selector';

const DashboardWithoutLayout = () => {
    const getOrganizations = $api.useQuery('get', '/user_associations/me', {
        params: {
            query: {
                expand: ['organizations'],
            },
        },
    });

    const { active } = React.useMemo(() => {
        const active =
            getOrganizations.data?.filter((org) => org.status === 'active') ??
            [];

        const pending =
            getOrganizations.data?.filter((org) => org.status === 'pending') ??
            [];

        return { active, pending };
    }, [getOrganizations.data]);

    return (
        <VStack className="flex-1 " space="md">
            <VStack className="w-full">
                <H1>Organizations</H1>
                <Text className="mt-2 text-text">
                    This is a list of all the organizations you are associated
                    with.
                </Text>

                <TenantSelector
                    data={active}
                    isLoading={getOrganizations.isLoading}
                />
            </VStack>
        </VStack>
    );
};

export const Account = () => {
    return (
        <AppLayout>
            <DashboardWithoutLayout />
        </AppLayout>
    );
};
