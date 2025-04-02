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
import { Label } from '@/components/ui/label';
import { RadioGroupItem } from '@/components/ui/radio-group';

import { Text } from '@/components/ui/text';
import type { components } from '@/types/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import { z } from 'zod';

const editWorkspaceSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    logo: z.string().refine((val) => {
        if (val.length === 0) return true;
        const url = z.string().url().safeParse(val);
        return url.success;
    }, 'Logo URL must be a valid URL'),
    billing: z.string().refine((val) => {
        if (val.length === 0) return true;
        const email = z.string().email().safeParse(val);
        return email.success;
    }, 'Billing email must be a valid email'),

    organizationType: z.enum(['airline', 'carrier', 'warehouse']),
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
            logo: '',
            billing: '',
        },
    });

    const onSubmit = (values: EditWorkspaceSchemaType) => {
        console.log('Form values:', values);
        // Handle form submission here
    };

    return (
        <Dialog
            open={!!editingTenant}
            onOpenChange={(open) => !open && setEditingTenant(null)}
        >
            <DialogContent className="sm:w-[600px] max-h-[90vh] overflow-y-auto">
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
                                                form.setFocus('billing')
                                            }
                                            {...field}
                                        />
                                    </View>
                                </View>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="logo"
                            render={({ field }) => (
                                <View className="flex flex-row items-center gap-4">
                                    <View className="w-1/4 text-right">
                                        <Label className="" htmlFor="name">
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
                            name="billing"
                            render={({ field }) => (
                                <View className="flex flex-row items-center gap-4">
                                    <View className="w-1/4 text-right">
                                        <Label className="" htmlFor="name">
                                            Billing Email
                                        </Label>
                                    </View>
                                    <View className="w-3/4">
                                        <FormInput
                                            placeholder="billing@cc.co"
                                            autoCapitalize="none"
                                            autoComplete="email"
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
                                                htmlFor="name"
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
                        <Text>Save changes</Text>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
