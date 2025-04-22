import type { GooglePlaceAddress } from './schema';
import { GooglePlaceAddressSchema } from './schema';

export class AddressWrapper {
    private raw: Record<string, unknown>;
    private parsed: GooglePlaceAddress | undefined;

    constructor(rawAddress: Record<string, unknown> | undefined) {
        this.raw = rawAddress ?? {};

        const { success, data } =
            GooglePlaceAddressSchema.safeParse(rawAddress);

        if (!success) {
            this.parsed = undefined;
        }

        this.parsed = data;
    }

    isValid() {
        return !!this.parsed;
    }

    getFormattedAddress() {
        return this.parsed?.formatted_address;
    }

    getPlaceId() {
        return this.parsed?.place_id;
    }

    getCoords() {
        return this.parsed?.geometry?.location;
    }

    getCity() {
        return this.parsed?.address_components?.find((comp) =>
            comp.types.includes('locality'),
        )?.long_name;
    }

    getState() {
        return this.parsed?.address_components?.find((comp) =>
            comp.types.includes('administrative_area_level_1'),
        )?.short_name;
    }

    getCountry() {
        return this.parsed?.address_components?.find((comp) =>
            comp.types.includes('country'),
        )?.short_name;
    }

    getZipCode() {
        return this.parsed?.address_components?.find((comp) =>
            comp.types.includes('postal_code'),
        )?.long_name;
    }

    getTypes() {
        return this.parsed?.types;
    }

    getPhoneNumber() {
        return this.parsed?.formatted_phone_number;
    }

    getWeekdayHours() {
        return this.parsed?.opening_hours?.weekday_text;
    }

    getWebsite(): URL | null {
        if (!this.parsed?.website) {
            return null;
        }
        const url = new URL(this.parsed?.website);
        return url;
    }
}
