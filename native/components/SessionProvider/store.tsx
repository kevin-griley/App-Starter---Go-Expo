import * as SecureStore from 'expo-secure-store';

import { Platform } from 'react-native';

export const SESSION_STORAGE_KEY = 'session_token';

export async function setSessionToken(value: string | null | undefined) {
    if (Platform.OS !== 'web') {
        if (!value) {
            await SecureStore.deleteItemAsync(SESSION_STORAGE_KEY);
        } else {
            await SecureStore.setItemAsync(SESSION_STORAGE_KEY, value);
        }
    }
}

export async function getSessionToken() {
    if (Platform.OS !== 'web') {
        return SecureStore.getItemAsync(SESSION_STORAGE_KEY);
    }
    return null;
}
