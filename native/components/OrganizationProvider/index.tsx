import { fetchClient, queryClient } from '@/lib/api/client';
import type { components } from '@/types/schema';
import { useFocusEffect } from 'expo-router';
import type { ReactNode } from 'react';
import * as React from 'react';
import { getOrganizationToken, setOrganizationToken } from './store';

type OrganizationData = components['schemas']['data.Organization'];

export interface OrganizationContextValue {
    organization: OrganizationData | null;
    setOrganization: (data: OrganizationData | null) => Promise<void>;
    init: boolean;
}

export const OrganizationContext = React.createContext<
    OrganizationContextValue | undefined
>(undefined);

interface OrganizationProviderProps {
    children: ReactNode;
}

export function OrganizationProvider({ children }: OrganizationProviderProps) {
    const [init, setInit] = React.useState(false);

    const [organization, set] = React.useState<OrganizationData | null>(null);

    const setOrganization = React.useCallback(
        async (data: OrganizationData | null) => {
            setOrganizationToken(data?.id ?? null)
                .then(() => set(data))
                .then(() => queryClient.clear())
                .then(() => queryClient.invalidateQueries());
        },
        [],
    );

    const fetchOrganization = React.useCallback(async (token: string) => {
        return fetchClient.GET('/organization/{ID}', {
            params: {
                path: {
                    ID: token,
                },
            },
        });
    }, []);

    const preloadOrganization = React.useCallback(() => {
        async function preload() {
            try {
                const token = await getOrganizationToken();
                if (!token) return;

                const { data } = await fetchOrganization(token);
                set(data ?? null);
            } catch {
                set(null);
            } finally {
                setInit(true);
            }
        }
        preload();
    }, []);

    useFocusEffect(preloadOrganization);

    return (
        <OrganizationContext.Provider
            value={{
                organization,
                setOrganization,
                init,
            }}
        >
            {children}
        </OrganizationContext.Provider>
    );
}

export function useOrganization() {
    const context = React.useContext(OrganizationContext);
    if (context === undefined) {
        throw new Error(
            'useOrganization must be used within a OrganizationProvider',
        );
    }
    return context;
}
