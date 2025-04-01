import { useOrganization } from '@/components/OrganizationProvider';
import { Button } from '@/components/ui/button';
import { CardDefault } from '@/components/ui/card/default';
import { HStack } from '@/components/ui/hstack';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { H1 } from '@/components/ui/typography';
import { VStack } from '@/components/ui/vstack';
import { $api } from '@/lib/api/client';
import { Link } from 'expo-router';
import * as React from 'react';
import { ActivityIndicator } from 'react-native';
import { AppLayout } from '../layout';

const DashboardWithoutLayout = () => {
    const { setOrganization } = useOrganization();

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
                    <HStack wrap className="justify-center md:justify-start">
                        {getOrganizations.isLoading ? (
                            <>
                                <Skeleton className="h-80 w-96 rounded-md" />
                                <Skeleton className="h-80 w-96 rounded-md" />
                            </>
                        ) : active.length === 0 ? (
                            <CardDefault
                                title={
                                    'No organizations found. Please create one.'
                                }
                                content={
                                    'You are not associated with any organizations. Please create one.'
                                }
                            />
                        ) : (
                            active.map((assoc) => {
                                const { organization } = assoc;

                                if (!organization) {
                                    return (
                                        <CardDefault
                                            key={assoc.id}
                                            title={'Organization Error'}
                                            content={'Organization Error'}
                                        />
                                    );
                                }

                                return (
                                    <CardDefault
                                        key={assoc.id}
                                        title={
                                            organization.name ??
                                            'Organization Error'
                                        }
                                        description={
                                            <HStack className="w-full justify-between">
                                                <Text>
                                                    Type:{' '}
                                                    {organization.organization_type?.toUpperCase() ??
                                                        'Organization Type Error'}
                                                </Text>
                                                <Text>
                                                    IsDeleted:{' '}
                                                    {organization.is_deleted
                                                        ? 'Yes'
                                                        : 'No'}
                                                </Text>
                                            </HStack>
                                        }
                                        content={
                                            <VStack>
                                                <Text>
                                                    Status:{' '}
                                                    {assoc.status?.toUpperCase() ??
                                                        'Status Error'}
                                                </Text>
                                                <Text>
                                                    Premissions:{' '}
                                                    {assoc.permissions?.join(
                                                        ', ',
                                                    ) ?? 'Permissions Error'}
                                                </Text>
                                            </VStack>
                                        }
                                        footer={
                                            <Button
                                                className="w-full"
                                                variant="secondary"
                                                onPress={() => {
                                                    setOrganization(
                                                        organization,
                                                    );
                                                }}
                                            >
                                                <Text> Open </Text>
                                            </Button>
                                        }
                                    />
                                );
                            })
                        )}
                    </HStack>

                    <VStack className="w-full mx-7 my-4 max-w-sm self-center md:self-end">
                        <Link href="/create-organization" asChild>
                            <Button>
                                <Text>Create Organization</Text>
                            </Button>
                        </Link>

                        <Button
                            onPress={() => getOrganizations.refetch()}
                            variant="outline"
                        >
                            {getOrganizations.isFetching ? (
                                <ActivityIndicator size="small" />
                            ) : (
                                <Text>Refresh</Text>
                            )}
                        </Button>
                    </VStack>
                </VStack>
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
