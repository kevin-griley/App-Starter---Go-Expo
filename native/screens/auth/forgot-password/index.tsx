import { Button } from '@/components/ui/button';
import { Form, FormField, FormInput } from '@/components/ui/form';
import { Text } from '@/components/ui/text';
import { H1 } from '@/components/ui/typography';
import { VStack } from '@/components/ui/vstack';
import { $api } from '@/lib/api/client';
import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, View } from 'react-native';
import { z } from 'zod';
import { AuthLayout } from '../layout';

const ForgotPasswordSchema = z.object({
    email: z.string().min(1, 'Email is required').email(),
});

type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>;

const ForgotPasswordWithLeftBackground = () => {
    const postResetRequest = $api.useMutation('post', '/auth/reset/request');

    const form = useForm<ForgotPasswordSchemaType>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    async function onSubmit(values: ForgotPasswordSchemaType) {
        return postResetRequest.mutateAsync({
            body: {
                email: values.email,
            },
        });
    }

    React.useEffect(() => {
        if (postResetRequest.isSuccess) {
            // TODO: Show success message
        }
        if (postResetRequest.isError) {
            form.setError('email', { message: postResetRequest.error.error });
        }
    }, [postResetRequest.status]);

    return (
        <VStack className="max-w-[440px] w-full" space="md">
            <VStack>
                <H1>Forgot Password?</H1>
                <Text> Enter email ID associated with your account. </Text>

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
                                            onSubmitEditing={form.handleSubmit(
                                                onSubmit,
                                            )}
                                            {...field}
                                        />
                                    )}
                                />
                            </View>
                        </Form>
                    </VStack>

                    <VStack className="w-full my-7 " space="lg">
                        <Button
                            className="w-full"
                            onPress={form.handleSubmit(onSubmit)}
                        >
                            {/* eslint-disable-next-line no-constant-condition */}
                            {postResetRequest.isPending ? (
                                <ActivityIndicator size="small" />
                            ) : (
                                <Text>Send Link</Text>
                            )}
                        </Button>
                    </VStack>
                </VStack>
            </VStack>
        </VStack>
    );
};

export const ForgotPassword = () => {
    return (
        <AuthLayout>
            <ForgotPasswordWithLeftBackground />
        </AuthLayout>
    );
};
