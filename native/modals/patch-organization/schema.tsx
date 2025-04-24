import type { components } from '@/types/schema';
import { z } from 'zod';

export const patchOrganizationSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    logo_url: z.string().refine((val) => {
        if (val.length === 0) return true;
        const url = z.string().url().safeParse(val);
        return url.success;
    }, 'Logo URL must be a valid URL'),
    address: z.any().refine(
        (val) => {
            if (typeof val !== 'object') {
                return false;
            }
            if (!val.geometry) {
                return false;
            }
            if (!val.formatted_address) {
                return false;
            }
            return true;
        },
        { message: 'Please select a result from google' },
    ),
    contactInfo: z.string().min(1, 'Contact info is required'),
    organizationType: z.enum(['airline', 'carrier', 'warehouse']),

    scacCode: z.string().refine((val) => {
        if (val.length === 0) return true;
        const scac = z.string().length(4).safeParse(val);
        return scac.success;
    }, 'SCAC must be 4 uppercase letters'),
});

export type PatchOrganizationSchemaType = z.infer<
    typeof patchOrganizationSchema
>;

export type Organization = components['schemas']['data.Organization'];
