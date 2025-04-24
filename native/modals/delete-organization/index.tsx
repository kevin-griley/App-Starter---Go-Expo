import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import { useModal } from '@/components/ModalManager/context';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Form, FormField, FormInput } from '@/components/ui/form';
import { Text } from '@/components/ui/text';
import { H4 } from '@/components/ui/typography';
import { $api, queryClient } from '@/lib/api/client';
import type { components } from '@/types/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Terminal } from 'lucide-react-native';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, View } from 'react-native';
import type { deleteOrganizationSchemaType } from './schema';
import { deleteOrganizationSchema } from './schema';

type Organization = components['schemas']['data.Organization'];

export interface DeleteOrganizationProps {
    closeModal: () => void;
    organization: Organization | null;
}

const DeleteOrganization: React.FC<DeleteOrganizationProps> = (props) => {
    const { closeModal, organization } = props;

    const { closeAllModals } = useModal();

    const form = useForm<deleteOrganizationSchemaType>({
        resolver: zodResolver(deleteOrganizationSchema),
        defaultValues: {
            id: organization?.id ?? '',
            delete: '',
        },
    });

    const deleteOrganization = $api.useMutation('delete', '/organization/{ID}');

    async function onSubmit(value: deleteOrganizationSchemaType) {
        if (deleteOrganization.status === 'pending') return;

        return deleteOrganization.mutateAsync({
            params: {
                path: {
                    ID: value?.id ?? '',
                },
            },
        });
    }

    React.useEffect(() => {
        if (deleteOrganization.isSuccess) {
            const { queryKey } = $api.queryOptions(
                'get',
                '/user_associations/me',
            );

            queryClient.invalidateQueries({
                queryKey,
            });

            closeAllModals();
        }
        if (deleteOrganization.isError) {
            console.log(deleteOrganization.error);
        }
    }, [deleteOrganization.status]);

    return (
        <Dialog open onOpenChange={closeModal}>
            <DialogContent className="w-screen max-w-2xl max-h-[90vh] overflow-y-auto flex-col gap-6">
                <DialogHeader className="self-stretch">
                    <DialogTitle>Delete Workspace</DialogTitle>
                </DialogHeader>

                <H4 className="text-lg">
                    Are you sure you want to delete this workspace?
                </H4>
                <Alert icon={Terminal} variant="destructive">
                    <AlertTitle
                        variant="destructive"
                        className="font-semibold text-lg"
                    >
                        Warning, entering the danger zone!
                    </AlertTitle>

                    <View className="h-2" />

                    <AlertDescription variant="destructive">
                        This action will soft delete the workspace. Your data
                        will not be permanently removed and can still be
                        recovered.
                    </AlertDescription>

                    <View className="h-2" />

                    <AlertDescription variant="destructive">
                        If you need help recovering your workspace or have
                        questions, please reach out to our support team.
                    </AlertDescription>
                </Alert>

                <Form {...form}>
                    <FormField
                        control={form.control}
                        name="delete"
                        render={({ field }) => (
                            <FormInput
                                label="To confirm, type 'delete' in the field below"
                                {...field}
                            />
                        )}
                    />
                </Form>

                <DialogFooter>
                    <Button onPress={closeModal}>
                        <Text>Cancel</Text>
                    </Button>

                    <Button
                        disabled={form.watch('delete') !== 'delete'}
                        onPress={form.handleSubmit(onSubmit)}
                        className="bg-error"
                    >
                        {deleteOrganization.status === 'pending' ? (
                            <ActivityIndicator size="small" />
                        ) : (
                            <Text>Yes, Delete Workspace</Text>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteOrganization;
