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

import { Text } from '@/components/ui/text';
import { $api, queryClient } from '@/lib/api/client';
import type { components } from '@/types/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, Image, View } from 'react-native';
import { z } from 'zod';

const editWorkspaceSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    logo_url: z.string().refine((val) => {
        if (val.length === 0) return true;
        const url = z.string().url().safeParse(val);
        return url.success;
    }, 'Logo URL must be a valid URL'),
    address: z.any().refine(
        (val) => {
            if (typeof val !== 'object') {
                return false;
            }
            if (!val.geometry) {
                return false;
            }
            if (!val.formatted_address) {
                return false;
            }
            return true;
        },
        { message: 'Please select a result from google' },
    ),
    contactInfo: z.string().min(1, 'Contact info is required'),
    organizationType: z.enum(['airline', 'carrier', 'warehouse']),

    scacCode: z.string().refine((val) => {
        if (val.length === 0) return true;
        const scac = z.string().length(4).safeParse(val);
        return scac.success;
    }, 'SCAC must be 4 uppercase letters'),
});

type EditWorkspaceSchemaType = z.infer<typeof editWorkspaceSchema>;

type Organization = components['schemas']['data.Organization'];

interface Props {
    editingTenant: Organization | null;
    setEditingTenant: React.Dispatch<React.SetStateAction<Organization | null>>;
}

export function EditWorkspace({ editingTenant, setEditingTenant }: Props) {
    const form = useForm<EditWorkspaceSchemaType>({
        resolver: zodResolver(editWorkspaceSchema),
        defaultValues: {
            name: editingTenant?.name ?? '',
            address: editingTenant?.address ?? {},
            organizationType: editingTenant?.organization_type ?? 'carrier',
            contactInfo: editingTenant?.contact_info ?? '',
            scacCode: editingTenant?.scac ?? '',
            logo_url: editingTenant?.logo_url ?? '',
        },
    });

    const patchOrganization = $api.useMutation('patch', '/organization/{ID}');

    async function onSubmit(values: EditWorkspaceSchemaType) {
        if (patchOrganization.status === 'pending') return;

        return patchOrganization.mutateAsync({
            params: {
                path: {
                    ID: editingTenant?.id ?? '',
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

            setEditingTenant(null);
        }
        if (patchOrganization.isError) {
            console.log(patchOrganization.error);
            form.setError('name', { message: patchOrganization.error.error });
        }
    }, [patchOrganization.status]);

    return (
        <Dialog
            open={!!editingTenant}
            onOpenChange={(open) => !open && setEditingTenant(null)}
        >
            <DialogContent className="w-screen max-w-2xl max-h-[90vh] overflow-y-auto">
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
                                        <GoogleInput
                                            placeholder="Address"
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
}
