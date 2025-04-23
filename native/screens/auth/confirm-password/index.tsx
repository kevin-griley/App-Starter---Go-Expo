import { Button } from '@/components/ui/button';
import { Form, FormField, FormInput } from '@/components/ui/form';
import { Text } from '@/components/ui/text';
import { H1 } from '@/components/ui/typography';
import { $api } from '@/lib/api/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, View } from 'react-native';
import { z } from 'zod';
import { AuthLayout } from '../layout';

const ConfirmPasswordSchema = z
    .object({
        password: z
            .string()
            .min(6, 'Must be at least 8 characters in length')
            .regex(new RegExp('.*[A-Z].*'), 'One uppercase character')
            .regex(new RegExp('.*[a-z].*'), 'One lowercase character')
            .regex(new RegExp('.*\\d.*'), 'One number')
            .regex(
                new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'),
                'One special character',
            ),
        confirmpassword: z
            .string()
            .min(6, 'Must be at least 8 characters in length')
            .regex(new RegExp('.*[A-Z].*'), 'One uppercase character')
            .regex(new RegExp('.*[a-z].*'), 'One lowercase character')
            .regex(new RegExp('.*\\d.*'), 'One number')
            .regex(
                new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'),
                'One special character',
            ),
    })
    .superRefine((data, ctx) => {
        if (data.password !== data.confirmpassword) {
            return ctx.addIssue({
                code: 'custom',
                message: 'Passwords do not match',
                path: ['confirmpassword'],
            });
        }
    });

type ConfirmPasswordSchemaType = z.infer<typeof ConfirmPasswordSchema>;

const ConfirmPasswordWithLeftBackground = () => {
    const router = useRouter();
    const local = useLocalSearchParams();

    const postConfirmRequest = $api.useMutation('post', '/auth/reset/confirm');

    const form = useForm<ConfirmPasswordSchemaType>({
        resolver: zodResolver(ConfirmPasswordSchema),
        defaultValues: {
            password: '',
            confirmpassword: '',
        },
    });

    async function onSubmit(values: ConfirmPasswordSchemaType) {
        if (typeof local.token !== 'string') {
            form.setError('password', {
                message: 'Invalid email link',
            });
            form.setError('confirmpassword', {
                message: 'Invalid email link',
            });
            return;
        }

        return postConfirmRequest.mutateAsync({
            body: {
                confirm_code: local.token,
                new_password: values.password,
            },
        });
    }

    React.useEffect(() => {
        if (postConfirmRequest.isSuccess) {
            router.push('/sign-in');
        }
        if (postConfirmRequest.isError) {
            form.setError('password', {
                message: postConfirmRequest.error.error,
            });
            form.setError('confirmpassword', {
                message: postConfirmRequest.error.error,
            });
        }
    }, [postConfirmRequest.status]);

    return (
        <View className="max-w-[440px] w-full">
            <View className="w-full flex-col gap-4">
                <H1>Create new password</H1>
                <Text>
                    {' '}
                    Your new password must be different from previously used
                    passwords{' '}
                </Text>

                <Form {...form}>
                    <View className="flex-col gap-6">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormInput
                                    label="Password"
                                    placeholder="********"
                                    description="Use a secure password."
                                    secureTextEntry
                                    autoComplete="password"
                                    onSubmitEditing={() =>
                                        form.setFocus('confirmpassword')
                                    }
                                    {...field}
                                />
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmpassword"
                            render={({ field }) => (
                                <FormInput
                                    label="Confirm Password"
                                    placeholder="********"
                                    secureTextEntry
                                    autoComplete="password"
                                    onSubmitEditing={form.handleSubmit(
                                        onSubmit,
                                    )}
                                    {...field}
                                />
                            )}
                        />
                    </View>
                </Form>

                <View />

                <Button
                    className="w-full"
                    onPress={form.handleSubmit(onSubmit)}
                >
                    {/* eslint-disable-next-line no-constant-condition */}
                    {postConfirmRequest.isPending ? (
                        <ActivityIndicator size="small" />
                    ) : (
                        <Text>Update Password</Text>
                    )}
                </Button>
            </View>
        </View>
    );
};

export const ConfirmPassword = () => {
    return (
        <AuthLayout>
            <ConfirmPasswordWithLeftBackground />
        </AuthLayout>
    );
};
