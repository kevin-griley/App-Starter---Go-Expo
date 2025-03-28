import { useSession } from '@/components/auth';
import { AlertDefault } from '@/components/ui/alert/default';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { H1 } from '@/components/ui/typography';
import { VStack } from '@/components/ui/vstack';
import * as React from 'react';

export const Dashboard = () => {
    const { session, logout, sessionRefresh } = useSession();

    return (
        <VStack className="flex-1 justify-center items-center" space="md">
            <VStack>
                <H1>You are logged in</H1>
                <Text> This is the dashboard </Text>

                <VStack className="w-full">
                    {session && (
                        <>
                            <AlertDefault
                                title={`${session.email} is logged in`}
                                description={JSON.stringify(session, null, 4)}
                                variant="success"
                            />

                            <Button
                                onPress={() => logout()}
                                variant="destructive"
                            >
                                <Text>Logout</Text>
                            </Button>

                            <Button
                                onPress={() => sessionRefresh()}
                                variant="outline"
                            >
                                <Text>Refresh</Text>
                            </Button>
                        </>
                    )}
                </VStack>
            </VStack>
        </VStack>
    );
};
