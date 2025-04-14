import { z } from 'zod';

export const GooglePlaceAddressSchema = z.object({
    address_components: z
        .array(
            z.object({
                long_name: z.string(),
                short_name: z.string(),
                types: z.array(z.string()),
            }),
        )
        .optional(),
    formatted_address: z.string(),
    formatted_phone_number: z.string().optional(),
    geometry: z
        .object({
            location: z.object({
                lat: z.number(),
                lng: z.number(),
            }),
        })
        .optional(),
    name: z.string().optional(),
    opening_hours: z
        .object({
            weekday_text: z.array(z.string()),
        })
        .optional(),
    place_id: z.string(),
    types: z.array(z.string()).optional(),
    utc_offset: z.number().optional(),
    vicinity: z.string().optional(),
    website: z.string().optional(),
});

export type GooglePlaceAddress = z.infer<typeof GooglePlaceAddressSchema>;
