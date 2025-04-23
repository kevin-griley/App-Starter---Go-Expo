import { Button } from '@/components/ui/button';
import { Form, FormCheckbox, FormField, FormInput } from '@/components/ui/form';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { H1 } from '@/components/ui/typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, View } from 'react-native';

import { $api } from '@/lib/api/client';
import { z } from 'zod';
import { AuthLayout } from '../layout';

const signUpSchema = z
    .object({
        email: z.string().min(1, 'Email is required').email(),
        password: z
            .string()
            .min(8, 'Must be at least 8 characters in length')
            .max(20, 'Must be at most 20 characters in length')
            .regex(new RegExp('.*[A-Z].*'), 'One uppercase character')
            .regex(new RegExp('.*[a-z].*'), 'One lowercase character')
            .regex(new RegExp('.*\\d.*'), 'One number'),

        confirmpassword: z
            .string()
            .min(8, 'Must be at least 8 characters in length')
            .max(20, 'Must be at most 20 characters in length')
            .regex(new RegExp('.*[A-Z].*'), 'One uppercase character')
            .regex(new RegExp('.*[a-z].*'), 'One lowercase character')
            .regex(new RegExp('.*\\d.*'), 'One number'),

        rememberme: z.boolean().refine((val) => val === true, {
            message: 'You must accept the Terms of Use & Privacy Policy',
        }),
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

type SignUpSchemaType = z.infer<typeof signUpSchema>;

const SignUpWithLeftBackground = () => {
    const router = useRouter();

    const form = useForm<SignUpSchemaType>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmpassword: '',
            rememberme: false,
        },
    });

    const postUser = $api.useMutation('post', '/user');

    async function onSubmit(values: SignUpSchemaType) {
        if (postUser.status === 'pending') return;

        return postUser.mutateAsync({
            body: {
                email: values.email,
                password: values.password,
            },
        });
    }

    React.useEffect(() => {
        if (postUser.isSuccess) {
            router.push('/sign-in');
        }
        if (postUser.isError) {
            form.setError('email', { message: postUser.error.error });
        }
    }, [postUser.status]);

    return (
        <View className="max-w-[440px] w-full">
            <View className="flex-col gap-4">
                <H1>Sign up</H1>
                <Text> Sign up and start using **Company** </Text>

                <Form {...form}>
                    <View className="gap-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormInput
                                    label="Email"
                                    placeholder="hello@email.ai"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    onSubmitEditing={() =>
                                        form.setFocus('password')
                                    }
                                    {...field}
                                />
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormInput
                                    label="Password"
                                    placeholder="********"
                                    description="Use a secure password."
                                    secureTextEntry
                                    autoComplete="new-password"
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
                                    passwordRules="minlength: 8; maxlength: 20; required: lower; required: upper; required: digit;"
                                    onSubmitEditing={form.handleSubmit(
                                        onSubmit,
                                    )}
                                    {...field}
                                />
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="rememberme"
                            render={({ field }) => (
                                <FormCheckbox
                                    label="I accept the Terms of Use & Privacy Policy"
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
                    {postUser.status === 'pending' ? (
                        <ActivityIndicator size="small" />
                    ) : (
                        <Text>Sign up</Text>
                    )}
                </Button>

                <HStack className="self-center">
                    <Text>Already have an account?</Text>

                    <Link href="/sign-in" asChild>
                        <Text className="underline font-medium text-text group-hover/link:text-text  group-hover/pressed:text-text">
                            Login
                        </Text>
                    </Link>
                </HStack>
            </View>
        </View>
    );
};

export const SignUp = () => {
    return (
        <AuthLayout>
            <SignUpWithLeftBackground />
        </AuthLayout>
    );
};
