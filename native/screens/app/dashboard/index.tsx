import { useSession } from '@/components/SessionProvider';
import { AlertDefault } from '@/components/ui/alert/default';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { H1 } from '@/components/ui/typography';
import { VStack } from '@/components/ui/vstack';
import { $api } from '@/lib/api/client';
import { Link, useFocusEffect } from 'expo-router';
import * as React from 'react';
import { AppLayout } from '../layout';

const DashboardWithoutLayout = () => {
    const { session, sessionRefresh } = useSession();

    const getOrganizations = $api.useQuery('get', '/user_associations/me', {
        params: {
            query: {
                expand: ['organizations'],
            },
        },
    });

    React.useEffect(() => {
        if (getOrganizations.data) {
            console.log('getOrganizations', getOrganizations.data);
        }
        if (getOrganizations.error) {
            console.log('getOrganizations error', getOrganizations.error);
        }
    }, [getOrganizations.status]);

    const refetch = React.useCallback(() => {
        getOrganizations.refetch();
    }, [getOrganizations]);

    useFocusEffect(refetch);

    return (
        <VStack className="flex-1 justify-center items-center" space="md">
            <VStack>
                <H1>You are logged in</H1>
                <Text> This is the dashboard </Text>

                <VStack className="w-full">
                    {session && (
                        <AlertDefault
                            title={`${session.email} is logged in`}
                            description={JSON.stringify(session, null, 4)}
                            variant="success"
                        />
                    )}

                    {getOrganizations.data && (
                        <AlertDefault
                            title={`Organizations`}
                            description={getOrganizations.data?.map((org) => (
                                <Text key={org.id}>
                                    {org.organization?.name?.toUpperCase() ??
                                        'No organizations found'}{' '}
                                </Text>
                            ))}
                            variant="success"
                        />
                    )}

                    <Button
                        onPress={() => {
                            sessionRefresh();
                            getOrganizations.refetch();
                        }}
                        variant="outline"
                    >
                        <Text>Refresh</Text>
                    </Button>

                    <Link href="/create-organization" asChild>
                        <Button>
                            <Text>Create Organization</Text>
                        </Button>
                    </Link>
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
