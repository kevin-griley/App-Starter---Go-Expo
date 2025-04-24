import { z } from 'zod';

export const deleteOrganizationSchema = z.object({
    id: z.string().min(1, 'ID is required'),
    delete: z.string().refine((value) => {
        return value.toLowerCase() === 'delete';
    }, 'You must type "delete" to confirm'),
});

export type deleteOrganizationSchemaType = z.infer<
    typeof deleteOrganizationSchema
>;
