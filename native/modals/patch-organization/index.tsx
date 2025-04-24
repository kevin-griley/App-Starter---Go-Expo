import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormField,
    FormInput,
    FormRadioGroup,
} from '@/components/ui/form';
import { GoogleInput } from '@/components/ui/form/googleInput';
import { Label } from '@/components/ui/label';
import { RadioGroupItem } from '@/components/ui/radio-group';

import { useModal } from '@/components/ModalManager/context';
import { Text } from '@/components/ui/text';
import { $api, queryClient } from '@/lib/api/client';
import type { components } from '@/types/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, Image, View } from 'react-native';
import type { PatchOrganizationSchemaType } from './schema';
import { patchOrganizationSchema } from './schema';

type Organization = components['schemas']['data.Organization'];

export interface PatchOrganizationProps {
    closeModal: () => void;
    organization: Organization | null;
}

const PatchOrganization: React.FC<PatchOrganizationProps> = (props) => {
    const { closeModal, organization } = props;

    const { openModal } = useModal();

    const form = useForm<PatchOrganizationSchemaType>({
        resolver: zodResolver(patchOrganizationSchema),
        defaultValues: {
            name: organization?.name ?? '',
            address: organization?.address ?? {},
            organizationType: organization?.organization_type ?? 'carrier',
            contactInfo: organization?.contact_info ?? '',
            scacCode: organization?.scac ?? '',
            logo_url: organization?.logo_url ?? '',
        },
    });

    const patchOrganization = $api.useMutation('patch', '/organization/{ID}');

    async function onSubmit(values: PatchOrganizationSchemaType) {
        if (patchOrganization.status === 'pending') return;

        return patchOrganization.mutateAsync({
            params: {
                path: {
                    ID: organization?.id ?? '',
                },
            },
            body: {
                name: values.name,
                address: values.address,
                organization_type: values.organizationType,
                contact_info: values.contactInfo,
                logo_url: values.logo_url,
            },
        });
    }

    React.useEffect(() => {
        if (patchOrganization.isSuccess) {
            const { queryKey } = $api.queryOptions(
                'get',
                '/user_associations/me',
            );

            queryClient.invalidateQueries({
                queryKey,
            });

            closeModal();
        }
        if (patchOrganization.isError) {
            console.log(patchOrganization.error);
            form.setError('name', { message: patchOrganization.error.error });
        }
    }, [patchOrganization.status]);

    return (
        <Dialog open onOpenChange={closeModal}>
            <DialogContent className="w-screen max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="self-stretch">
                    <DialogTitle>Edit Workspace</DialogTitle>
                    <DialogDescription>
                        Make changes to your workspace settings here.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <View className="w-full gap-6 px-3">
                        <FormField
                            control={form.control}
                            name="scacCode"
                            render={({ field }) => (
                                <View className="flex flex-row items-center gap-4">
                                    <View className="w-1/4 text-right">
                                        <Label className="" htmlFor="scacCode">
                                            SCAC Code
                                        </Label>
                                    </View>
                                    <View className="w-3/4">
                                        <Text className="font-mono">
                                            {' '}
                                            {field.value.length === 4
                                                ? field.value.toUpperCase()
                                                : 'N/A'}{' '}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <View className="flex flex-row items-center gap-4">
                                    <View className="w-1/4 text-right">
                                        <Label className="" htmlFor="name">
                                            Name
                                        </Label>
                                    </View>
                                    <View className="w-3/4">
                                        <FormInput
                                            placeholder="My Workspace"
                                            autoCapitalize="none"
                                            autoComplete="organization-title"
                                            onSubmitEditing={() =>
                                                form.setFocus('address')
                                            }
                                            {...field}
                                        />
                                    </View>
                                </View>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <View className="flex flex-row items-start gap-4">
                                    <View className="w-1/4 text-right mt-2">
                                        <Label className="" htmlFor="address">
                                            Address
                                        </Label>
                                    </View>
                                    <View className="w-3/4 z-10">
                                        <GoogleInput {...field} />
                                    </View>
                                </View>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="logo_url"
                            render={({ field }) => (
                                <View className="flex flex-row items-center gap-4">
                                    <View className="w-1/4 text-right">
                                        <Label className="" htmlFor="logo">
                                            Logo URL
                                        </Label>
                                    </View>
                                    <View className="w-3/4">
                                        <FormInput
                                            placeholder="https://example.com/logo.png"
                                            autoCapitalize="none"
                                            autoComplete="url"
                                            {...field}
                                        />
                                    </View>
                                </View>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="logo_url"
                            render={({ field }) => (
                                <View className="flex flex-row items-center gap-4">
                                    <View className="w-1/4 text-right">
                                        <Label className="" htmlFor="logo">
                                            Preview
                                        </Label>
                                    </View>
                                    <View className="w-3/4">
                                        <View className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-base border-2 border-border bg-bw">
                                            <Image
                                                id="logo-preview"
                                                source={{
                                                    uri: field.value,
                                                }}
                                                alt="Logo preview"
                                                width={64}
                                                height={64}
                                                className="h-full w-full object-cover"
                                            />
                                        </View>
                                    </View>
                                </View>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="contactInfo"
                            render={({ field }) => (
                                <View className="flex flex-row items-center gap-4">
                                    <View className="w-1/4 text-right">
                                        <Label
                                            className=""
                                            htmlFor="contactInfo"
                                        >
                                            Contact Info
                                        </Label>
                                    </View>
                                    <View className="w-3/4">
                                        <FormInput
                                            placeholder="Contact Info"
                                            autoCapitalize="none"
                                            autoComplete="off"
                                            onSubmitEditing={() =>
                                                form.setFocus(
                                                    'organizationType',
                                                )
                                            }
                                            {...field}
                                        />
                                    </View>
                                </View>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="organizationType"
                            defaultValue="carrier"
                            render={({ field }) => {
                                function onLabelPress(
                                    label: 'carrier' | 'warehouse' | 'airline',
                                ) {
                                    return () => {
                                        form.setValue(
                                            'organizationType',
                                            label,
                                        );
                                    };
                                }
                                return (
                                    <View className="flex flex-row items-center gap-6">
                                        <View className="w-1/4 text-right">
                                            <Label
                                                className="break-normal"
                                                htmlFor="organizationType"
                                            >
                                                Organization Type
                                            </Label>
                                        </View>
                                        <View className="w-3/4">
                                            <FormRadioGroup
                                                className="gap-4"
                                                {...field}
                                            >
                                                {(
                                                    [
                                                        'carrier',
                                                        'warehouse',
                                                        'airline',
                                                    ] as const
                                                ).map((value) => {
                                                    return (
                                                        <View
                                                            key={value}
                                                            className={
                                                                'flex flex-row gap-2 items-center'
                                                            }
                                                        >
                                                            <RadioGroupItem
                                                                aria-labelledby={`label-for-${value}`}
                                                                value={value}
                                                            />
                                                            <Label
                                                                nativeID={`label-for-${value}`}
                                                                className="capitalize"
                                                                onPress={onLabelPress(
                                                                    value,
                                                                )}
                                                            >
                                                                {value}
                                                            </Label>
                                                        </View>
                                                    );
                                                })}
                                            </FormRadioGroup>
                                        </View>
                                    </View>
                                );
                            }}
                        />
                    </View>
                </Form>

                <DialogFooter>
                    <Button
                        className="bg-error"
                        onPress={() => openModal('DELETE_ORGANIZATION', props)}
                    >
                        <Text>Delete</Text>
                    </Button>

                    <Button onPress={form.handleSubmit(onSubmit)}>
                        {patchOrganization.status === 'pending' ? (
                            <ActivityIndicator size="small" />
                        ) : (
                            <Text>Save changes</Text>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PatchOrganization;
