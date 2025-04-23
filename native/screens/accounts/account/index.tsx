import { Text } from '@/components/ui/text';
import { H1 } from '@/components/ui/typography';
import { $api } from '@/lib/api/client';
import * as React from 'react';
import { View } from 'react-native';
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
        <View className="flex-1">
            <View className="w-full flex-col gap-4">
                <H1>Organizations</H1>
                <Text className="mt-2 text-text">
                    This is a list of all the organizations you are associated
                    with.
                </Text>

                <TenantSelector
                    data={active}
                    isLoading={getOrganizations.isLoading}
                />
            </View>
        </View>
    );
};

export const Account = () => {
    return (
        <AppLayout>
            <DashboardWithoutLayout />
        </AppLayout>
    );
};
