/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Crypto from 'expo-crypto';
import { useCallback, useEffect, useRef, useState } from 'react';
import type {
    GooglePlaceData,
    GooglePlaceDetail,
} from 'react-native-google-places-autocomplete';

export interface UseGooglePlacesAutocompleteOptions {
    proxyUrl: string;
    language?: string;
    minLength?: number;
    debounceTime?: number;
}

export interface UseGooglePlacesAutocompleteReturn {
    input: string;
    suggestions: GooglePlaceData[];
    loading: boolean;
    error: string | null;
    onChangeText(text: string): void;
    clear(): void;
    selectPlace(place: GooglePlaceData): Promise<GooglePlaceDetail | null>;
}

export function useGooglePlacesAutocomplete({
    proxyUrl,
    language = 'en',
    minLength = 2,
    debounceTime = 300,
}: UseGooglePlacesAutocompleteOptions): UseGooglePlacesAutocompleteReturn {
    const [input, setInput] = useState<string>('');
    const [suggestions, setSuggestions] = useState<GooglePlaceData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [sessionToken, setSessionToken] = useState<string>();

    const abortControllerRef = useRef<AbortController | null>(null);
    const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );

    // on mount, load or create a session token
    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const token = Crypto.randomUUID();
                if (active) setSessionToken(token);
            } catch (e) {
                console.error('useGooglePlacesAutocomplete token error', e);
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    function abortPrevious() {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    }

    const fetchSuggestions = useCallback(
        async (text: string) => {
            if (text.length < minLength || !sessionToken) {
                setSuggestions([]);
                return;
            }
            abortPrevious();
            const controller = new AbortController();
            abortControllerRef.current = controller;
            setLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams({
                    input: text,
                    sessiontoken: sessionToken,
                    language,
                });
                const res = await fetch(
                    `${proxyUrl}/place/autocomplete/json?${params}`,
                    {
                        signal: controller.signal,
                    },
                );
                const json = await res.json();
                setSuggestions(json.predictions ?? []);
            } catch (e: any) {
                if (e.name !== 'AbortError') {
                    setError(e.message);
                }
            } finally {
                setLoading(false);
            }
        },
        [proxyUrl, sessionToken, language, minLength],
    );

    const debouncedFetch = useCallback(
        (text: string) => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
            debounceTimeoutRef.current = setTimeout(() => {
                fetchSuggestions(text);
            }, debounceTime);
        },
        [fetchSuggestions, debounceTime],
    );

    const onChangeText = (text: string) => {
        setInput(text);
        debouncedFetch(text);
    };

    const clear = () => {
        setInput('');
        setSuggestions([]);
        setError(null);
    };

    const selectPlace = useCallback(
        async (place: GooglePlaceData): Promise<GooglePlaceDetail | null> => {
            if (!place.place_id || !sessionToken) {
                return null;
            }
            abortPrevious();
            const controller = new AbortController();
            abortControllerRef.current = controller;
            setLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams({
                    placeid: place.place_id,
                    sessiontoken: sessionToken,
                    language,
                });
                const res = await fetch(
                    `${proxyUrl}/place/details/json?${params}`,
                    {
                        signal: controller.signal,
                    },
                );
                const json = await res.json();
                const newToken = Crypto.randomUUID();
                setSessionToken(newToken);
                return (json.result ?? null) as GooglePlaceDetail;
            } catch (e: any) {
                if (e.name !== 'AbortError') {
                    setError(e.message);
                }
                return null;
            } finally {
                setLoading(false);
            }
        },
        [proxyUrl, sessionToken, language],
    );

    // cleanup on unmount
    useEffect(
        () => () => {
            abortPrevious();
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        },
        [],
    );

    return {
        input,
        suggestions,
        loading,
        error,
        onChangeText,
        clear,
        selectPlace,
    };
}
