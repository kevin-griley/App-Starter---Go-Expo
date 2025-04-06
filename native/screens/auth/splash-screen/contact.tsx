'use client';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormInput, FormTextarea } from '@/components/ui/form';
import { Text } from '@/components/ui/text';
import { H1, H2, P } from '@/components/ui/typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import { z } from 'zod';

const contactSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().min(1, 'Email is required').email(),
    message: z.string().min(1, 'Message is required'),
});

type ContactSchemaType = z.infer<typeof contactSchema>;

export function Contact() {
    const form = useForm<ContactSchemaType>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: '',
            email: '',
            message: '',
        },
    });

    return (
        <View
            className="w-full max-w-6xl overflow-hidden"
            style={{ borderRadius: 40 }}
        >
            <View className="grid lg:grid-cols-2">
                <View className="bg-black p-8 lg:p-16">
                    <H1 className="text-4xl md:text-6xl font-light text-white mb-12">
                        FAQS
                    </H1>
                    <View className="space-y-4">
                        <Accordion
                            type="single"
                            collapsible
                            className="space-y-4"
                        >
                            <AccordionItem value="item-1">
                                <AccordionTrigger>
                                    <Text>What is the cost of software?</Text>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <Text>
                                        The software is free for small
                                        businesses. Limits apply. For large
                                        businesses, we offer a subscription
                                        model based on usage.
                                    </Text>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-2">
                                <AccordionTrigger>
                                    <Text>
                                        Can I customize the software to fit my
                                        needs?
                                    </Text>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <Text>
                                        Yes, we offer a wide range of
                                        customization options, contact us for
                                        more details.
                                    </Text>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-3">
                                <AccordionTrigger>
                                    <Text>Who is this software for?</Text>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <Text>
                                        We service truckers, freight forwarders,
                                        ground handlers, and airlines. Our
                                        software is designed to help businesses
                                        of all sizes manage their operations
                                        more efficiently.
                                    </Text>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </View>
                </View>

                <View className="bg-black p-8 lg:p-16">
                    <View className="max-w-md mx-auto">
                        <H2 className="text-3xl text-white mb-2">
                            DIDN'T FIND YOUR ANSWER?
                        </H2>
                        <P className="text-white/80 mb-8">
                            Don't hesitate to contact us
                        </P>

                        <Form {...form}>
                            <View className="gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormInput
                                            placeholder="Name"
                                            autoCapitalize="words"
                                            onSubmitEditing={() =>
                                                form.setFocus('email')
                                            }
                                            {...field}
                                        />
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormInput
                                            placeholder="Email"
                                            autoCapitalize="none"
                                            autoComplete="email"
                                            onSubmitEditing={() =>
                                                form.setFocus('message')
                                            }
                                            {...field}
                                        />
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormTextarea
                                            placeholder="Message"
                                            autoCapitalize="sentences"
                                            className="min-h-[120px]"
                                            onSubmitEditing={form.handleSubmit(
                                                () => {
                                                    console.log('Submit');
                                                },
                                            )}
                                            {...field}
                                        />
                                    )}
                                />
                            </View>
                        </Form>

                        <Button
                            className="mt-4 w-full"
                            variant="noShadow"
                            onPress={form.handleSubmit(() =>
                                console.log('Submit'),
                            )}
                        >
                            <Text>SEND MESSAGE</Text>
                        </Button>
                    </View>
                </View>
            </View>
        </View>
    );
}
