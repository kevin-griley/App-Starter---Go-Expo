import * as SecureStore from 'expo-secure-store';

import { Platform } from 'react-native';

export const ORGANIZATION_STORAGE_KEY = 'organization_token';

export async function setOrganizationToken(value: string | null) {
    if (Platform.OS === 'web') {
        try {
            if (value === null) {
                localStorage.removeItem(ORGANIZATION_STORAGE_KEY);
            } else {
                localStorage.setItem(ORGANIZATION_STORAGE_KEY, value);
            }
        } catch (e) {
            console.error('Local storage is unavailable:', e);
        }
    } else {
        if (value === null) {
            await SecureStore.deleteItemAsync(ORGANIZATION_STORAGE_KEY);
        } else {
            await SecureStore.setItemAsync(ORGANIZATION_STORAGE_KEY, value);
        }
    }
}

export async function getOrganizationToken() {
    if (Platform.OS === 'web') {
        try {
            if (typeof localStorage !== 'undefined') {
                return localStorage.getItem(ORGANIZATION_STORAGE_KEY);
            }
        } catch (e) {
            console.error('Local storage is unavailable:', e);
        }
    } else {
        return SecureStore.getItemAsync(ORGANIZATION_STORAGE_KEY);
    }
}
