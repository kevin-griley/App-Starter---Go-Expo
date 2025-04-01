import { Button } from '@/components/ui/button';
import { CardDefault } from '@/components/ui/card/default';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { H1, H3 } from '@/components/ui/typography';
import { VStack } from '@/components/ui/vstack';
import { $api } from '@/lib/api/client';
import { Link } from 'expo-router';
import * as React from 'react';
import { AppLayout } from '../layout';

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
                <Text>
                    This is a list of all the organizations you are associated
                    with.
                </Text>

                <VStack className="w-full my-7">
                    <HStack wrap>
                        {active.length > 0 ? (
                            active.map((org, idx) => (
                                <CardDefault
                                    key={org.id}
                                    title={
                                        <H3>
                                            {idx + 1} -{' '}
                                            {org.organization?.name ??
                                                'Organization Error'}
                                        </H3>
                                    }
                                    description={
                                        <HStack className="w-full justify-between">
                                            <Text>
                                                Type:{' '}
                                                {org.organization?.organization_type?.toUpperCase() ??
                                                    'Organization Type Error'}
                                            </Text>
                                            <Text>
                                                IsDeleted:{' '}
                                                {org.organization?.is_deleted
                                                    ? 'Yes'
                                                    : 'No'}
                                            </Text>
                                        </HStack>
                                    }
                                    content={
                                        <VStack>
                                            <Text>
                                                Status:{' '}
                                                {org.status?.toUpperCase() ??
                                                    'Status Error'}
                                            </Text>
                                            <Text>
                                                Premissions:{' '}
                                                {org.permissions?.join(', ') ??
                                                    'Permissions Error'}
                                            </Text>
                                        </VStack>
                                    }
                                    footer={
                                        <Button
                                            className="w-full"
                                            variant="secondary"
                                        >
                                            <Text> Open </Text>
                                        </Button>
                                    }
                                />
                            ))
                        ) : (
                            <CardDefault
                                title={
                                    <H3>
                                        No organizations found. Please create
                                        one.
                                    </H3>
                                }
                                content={
                                    <Text>
                                        You are not associated with any
                                        organizations. Please create one.
                                    </Text>
                                }
                            />
                        )}
                    </HStack>

                    <VStack className="w-full m-7 max-w-sm self-end">
                        <Link href="/create-organization" asChild>
                            <Button>
                                <Text>Create Organization</Text>
                            </Button>
                        </Link>

                        <Button
                            onPress={() => getOrganizations.refetch()}
                            variant="outline"
                        >
                            <Text>Refresh</Text>
                        </Button>
                    </VStack>
                </VStack>
            </VStack>
        </VStack>
    );
};

export const Dashboard = () => {
    return (
        <AppLayout>
            <DashboardWithoutLayout />
        </AppLayout>
    );
};
