import { useOrganization } from '@/components/OrganizationProvider';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { useModal } from '@/components/ModalManager/context';
import { AddressWrapper } from '@/components/ui/form/googleInput/wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { H3 } from '@/components/ui/typography';
import { Check } from '@/lib/icons/Check';
import { Edit } from '@/lib/icons/Edit';
import { Plus } from '@/lib/icons/Plus';
import { cn } from '@/lib/utils';
import type { components } from '@/types/schema';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { Image, Pressable, View } from 'react-native';

type Association = components['schemas']['data.Association'];
type Organization = components['schemas']['data.Organization'];

interface Props {
    isLoading: boolean;
    data: Association[];
}

export function TenantSelector({ data, isLoading }: Props) {
    const router = useRouter();
    const { setOrganization } = useOrganization();
    const [hovered, setHovered] = React.useState<Organization | null>(null);

    const [selectedTenant, setSelectedTenant] =
        React.useState<Organization | null>(null);

    const handleSelectTenant = (org: Organization | undefined) => {
        if (!org) return;

        setSelectedTenant(org);
        setTimeout(() => {
            setOrganization(org);
        }, 500);
    };

    const { openModal, closeModal } = useModal();

    if (isLoading) {
        return (
            <View className="flex flex-wrap gap-6">
                {Array.from({ length: 2 }).map((_, index) => (
                    <Skeleton className="h-64 w-full rounded-md" key={index} />
                ))}
            </View>
        );
    }

    return (
        <View className="flex flex-row flex-wrap gap-6 px-1">
            {data.map((assoc) => {
                const address = new AddressWrapper(assoc.organization?.address);

                return (
                    <View
                        key={assoc.organization_id}
                        className="w-full max-w-sm"
                    >
                        <Card
                            className={cn(
                                'relative transition-all flex-1',
                                hovered?.id === assoc.organization_id
                                    ? 'hover:shadow-shadow'
                                    : '',
                            )}
                        >
                            {selectedTenant?.id === assoc.organization_id && (
                                <View className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-bw border-2 border-border">
                                    <Check className="h-4 w-4 text-text" />
                                </View>
                            )}
                            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                                <View className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-bw border-2 border-border">
                                    {assoc.organization?.logo_url && (
                                        <Image
                                            source={{
                                                uri: assoc.organization
                                                    .logo_url,
                                            }}
                                            alt="Organization Logo"
                                            className="h-full w-full object-cover"
                                        />
                                    )}
                                </View>

                                <View>
                                    <CardTitle
                                        className="text-xl"
                                        style={{ fontFamily: 'SpaceMono' }}
                                    >
                                        {assoc.organization?.name}
                                    </CardTitle>
                                    <CardDescription>
                                        {assoc.organization?.name}
                                    </CardDescription>
                                </View>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <View className="text-sm space-y-1">
                                    <Text>
                                        {assoc.organization?.organization_type?.toUpperCase()}
                                    </Text>
                                    <View>
                                        <Text>
                                            {[
                                                address.getCity(),
                                                address.getState(),
                                                address.getZipCode(),
                                                address.getCountry(),
                                            ]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </Text>
                                    </View>
                                </View>
                            </CardContent>
                            <CardFooter>
                                <View className="flex-1 flex-row gap-3">
                                    <Button
                                        onHoverIn={() =>
                                            setHovered(
                                                assoc.organization ?? null,
                                            )
                                        }
                                        onHoverOut={() => setHovered(null)}
                                        variant="neutral"
                                        className="flex-1"
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            handleSelectTenant(
                                                assoc.organization,
                                            );
                                        }}
                                    >
                                        <Text>Select workspace</Text>
                                    </Button>
                                    <Button
                                        onHoverIn={() =>
                                            setHovered(
                                                assoc.organization ?? null,
                                            )
                                        }
                                        onHoverOut={() => setHovered(null)}
                                        onPress={(e) => {
                                            e.stopPropagation();

                                            openModal('PATCH_ORGANIZATION', {
                                                closeModal,
                                                organization:
                                                    assoc.organization ?? null,
                                            });
                                        }}
                                    >
                                        <Edit
                                            className="text-mtext"
                                            size={18}
                                        />
                                    </Button>
                                </View>
                            </CardFooter>
                        </Card>
                    </View>
                );
            })}

            <Pressable
                className="w-full max-w-sm"
                onPress={() => {
                    console.log('Pressed create-organization');
                    router.push('/create-organization');
                }}
            >
                <Card className="flex flex-col items-center justify-center border-border border-dashed p-6 text-center flex-1 ">
                    <View className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-bw border-2 border-border">
                        <Plus className="h-6 w-6 text-text" />
                    </View>
                    <H3 className="mb-1 text-xl font-semibold text-mtext">
                        Create new workspace
                    </H3>
                    <Text className="text-sm text-mtext">
                        Set up a new workspace for your team
                    </Text>
                    <View className="h-4" />
                </Card>
            </Pressable>
        </View>
    );
}
