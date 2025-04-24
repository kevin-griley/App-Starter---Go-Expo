import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';

import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, View } from 'react-native';
import { z } from 'zod';

const postQuoteSchema = z.object({});

type PostQuoteSchemaType = z.infer<typeof postQuoteSchema>;

export interface PostQuotesProps {
    closeModal: () => void;
}

const PostQuotes: React.FC<PostQuotesProps> = (props) => {
    const { closeModal } = props;

    const form = useForm<PostQuoteSchemaType>({
        resolver: zodResolver(postQuoteSchema),
        defaultValues: {},
    });

    async function onSubmit(_values: PostQuoteSchemaType) {}

    return (
        <Dialog open onOpenChange={closeModal}>
            <DialogContent className="w-screen max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="self-stretch">
                    <DialogTitle>Create New Quote</DialogTitle>
                    <DialogDescription>
                        Create a new quote for your organization. Fill in the
                        required details and submit.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <View className="w-full gap-6 px-3"></View>
                </Form>

                <DialogFooter>
                    <Button onPress={form.handleSubmit(onSubmit)}>
                        <ActivityIndicator size="small" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PostQuotes;
