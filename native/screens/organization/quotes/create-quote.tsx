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

const createQuoteSchema = z.object({});

type CreateQuoteSchemaType = z.infer<typeof createQuoteSchema>;

interface Props {}

export function EditWorkspace(_props: Props) {
    const form = useForm<CreateQuoteSchemaType>({
        resolver: zodResolver(createQuoteSchema),
        defaultValues: {},
    });

    async function onSubmit(_values: CreateQuoteSchemaType) {}

    return (
        <Dialog open={false} onOpenChange={(open) => !open}>
            <DialogContent className="w-screen max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="self-stretch">
                    <DialogTitle>Edit Workspace</DialogTitle>
                    <DialogDescription>
                        Make changes to your workspace settings here.
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
}
