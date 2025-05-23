import { Button } from '@/components/ui/button';
import {
    Form,
    FormField,
    FormInput,
    FormRadioGroup,
} from '@/components/ui/form';
import { Text } from '@/components/ui/text';
import { H1 } from '@/components/ui/typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, Pressable, View } from 'react-native';

import { Label } from '@/components/ui/label';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { $api, queryClient } from '@/lib/api/client';
import { AuthLayout } from '@/screens/auth/layout';
import { z } from 'zod';

import { GoogleInput } from '@/components/ui/form/googleInput';
import { ArrowLeft } from '@/lib/icons/ArrowLeft';

const newOrgaizationSchema = z.object({
    name: z.string().min(1, 'Name is required'),
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
});

type NewOrgaizationSchemaType = z.infer<typeof newOrgaizationSchema>;

const CreateOrganizationWithoutLayout = () => {
    const router = useRouter();

    const form = useForm<NewOrgaizationSchemaType>({
        resolver: zodResolver(newOrgaizationSchema),
        defaultValues: {
            name: '',
            address: {},
            contactInfo: '',
            organizationType: 'carrier',
        },
    });

    const postOrganization = $api.useMutation('post', '/organization');

    async function onSubmit(values: NewOrgaizationSchemaType) {
        if (postOrganization.status === 'pending') return;

        return postOrganization.mutateAsync({
            body: {
                name: values.name,
                address: values.address,
                contact_info: values.contactInfo,
                organization_type: values.organizationType,
            },
        });
    }

    React.useEffect(() => {
        if (postOrganization.isSuccess) {
            form.reset();
            router.push('/my-account');
            const { queryKey } = $api.queryOptions(
                'get',
                '/user_associations/me',
            );

            queryClient.invalidateQueries({
                queryKey,
            });
        }
        if (postOrganization.isError) {
            console.log(postOrganization.error);
            form.setError('name', { message: postOrganization.error.error });
        }
    }, [postOrganization.status]);

    return (
        <View className="max-w-[440px] w-full">
            <View className="flex-col gap-6">
                <Pressable
                    onPress={() => {
                        if (router.canGoBack()) {
                            router.back();
                        } else {
                            router.push('/my-account');
                        }
                    }}
                >
                    <View className="flex-row gap-2">
                        <ArrowLeft className="text-text" />
                        <Text>Back</Text>
                    </View>
                </Pressable>

                <H1>Create Organization</H1>
                <Text>Create an organization to start using the app.</Text>

                <View className="w-full">
                    <View className="w-full flex-col gap-6">
                        <Form {...form}>
                            <View className="gap-7">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormInput
                                            label="Name"
                                            placeholder="Organization Name"
                                            autoCapitalize="none"
                                            autoComplete="organization-title"
                                            onSubmitEditing={() =>
                                                form.setFocus('address')
                                            }
                                            {...field}
                                        />
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <GoogleInput
                                            label="Address"
                                            {...field}
                                        />
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="contactInfo"
                                    render={({ field }) => (
                                        <FormInput
                                            label="Contact Info"
                                            placeholder="Contact Info"
                                            description="Email or phone number"
                                            autoCapitalize="none"
                                            autoComplete="off"
                                            onSubmitEditing={() =>
                                                form.setFocus(
                                                    'organizationType',
                                                )
                                            }
                                            {...field}
                                        />
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="organizationType"
                                    defaultValue="carrier"
                                    render={({ field }) => {
                                        function onLabelPress(
                                            label:
                                                | 'carrier'
                                                | 'warehouse'
                                                | 'airline',
                                        ) {
                                            return () => {
                                                form.setValue(
                                                    'organizationType',
                                                    label,
                                                );
                                            };
                                        }
                                        return (
                                            <FormRadioGroup
                                                label="Organization Type"
                                                description="Select your organization type."
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
                                        );
                                    }}
                                />
                            </View>
                        </Form>
                    </View>

                    <View className="w-full my-6 flex-col gap-6">
                        <Button
                            className="w-full"
                            onPress={form.handleSubmit(onSubmit)}
                        >
                            {postOrganization.status === 'pending' ? (
                                <ActivityIndicator size="small" />
                            ) : (
                                <Text>Create Organization</Text>
                            )}
                        </Button>
                    </View>
                </View>
            </View>
        </View>
    );
};

export const CreateOrganization = () => {
    return (
        <AuthLayout>
            <CreateOrganizationWithoutLayout />
        </AuthLayout>
    );
};
