import { Button } from '@/components/ui/button';
import { Form, FormCheckbox, FormField, FormInput } from '@/components/ui/form';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { H1 } from '@/components/ui/typography';
import { VStack } from '@/components/ui/vstack';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, View } from 'react-native';

import { useSession } from '@/components/auth';
import { AlertDefault } from '@/components/ui/alert/default';
import { z } from 'zod';
import { AuthLayout } from '../layout';

const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email(),
    password: z.string().min(1, 'Password is required'),
    rememberme: z.boolean(),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

const LoginWithLeftBackground = () => {
    const { session, login, error, isLoading, logout } = useSession();

    const form = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberme: false,
        },
    });

    function onSubmit(values: LoginSchemaType) {
        login({
            email: values.email,
            password: values.password,
        });
    }

    React.useEffect(() => {
        if (error) {
            form.setError('email', { message: error.error });
            form.setError('password', { message: error.error });
        }
    }, [error]);

    return (
        <VStack className="max-w-[440px] w-full" space="md">
            <VStack>
                <H1>Log in</H1>
                <Text> Login to start using **Company** </Text>

                <VStack className="w-full">
                    <VStack space="xl" className="w-full">
                        <Form {...form}>
                            <View className="gap-7">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormInput
                                            label="Email"
                                            placeholder="hello@email.ai"
                                            autoCapitalize="none"
                                            autoComplete="email"
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
                                            autoComplete="password"
                                            {...field}
                                        />
                                    )}
                                />

                                <HStack className="flex justify-between items-start">
                                    <FormField
                                        control={form.control}
                                        name="rememberme"
                                        render={({ field }) => (
                                            <FormCheckbox
                                                label="Remember me"
                                                description="Keep me logged in."
                                                {...field}
                                            />
                                        )}
                                    />

                                    <Link href="/auth/sign-up">
                                        <Text className="underline font-medium text-primary group-hover/link:text-primary">
                                            Forgot Password?
                                        </Text>
                                    </Link>
                                </HStack>
                            </View>
                        </Form>
                    </VStack>

                    <VStack className="w-full my-7 " space="lg">
                        <Button
                            className="w-full"
                            onPress={form.handleSubmit(onSubmit)}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" />
                            ) : (
                                <Text>Log in</Text>
                            )}
                        </Button>
                    </VStack>

                    <HStack className="self-center">
                        <Text>Don't have an account?</Text>

                        <Link href="/auth/sign-up">
                            <Text className="underline font-medium text-primary group-hover/link:text-primary  group-hover/pressed:text-primary">
                                Sign up
                            </Text>
                        </Link>
                    </HStack>

                    {session && (
                        <>
                            <AlertDefault
                                title={`${session.email} is logged in`}
                                description={JSON.stringify(
                                    {
                                        message: 'You are logged in',
                                        ...session,
                                    },
                                    null,
                                    4,
                                )}
                                variant="success"
                            />

                            <Button
                                onPress={() => logout()}
                                variant="destructive"
                            >
                                <Text>Logout</Text>
                            </Button>
                        </>
                    )}
                </VStack>
            </VStack>
        </VStack>
    );
};

export const SignIn = () => {
    return (
        <AuthLayout>
            <LoginWithLeftBackground />
        </AuthLayout>
    );
};
