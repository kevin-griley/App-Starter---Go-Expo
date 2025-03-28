import type { ReactNode } from 'react';
import React, { createContext, useContext } from 'react';

import { $api } from '@/lib/api/client';
import type { components } from '@/types/schema';
import { setSessionToken } from './store';

type UserData = components['schemas']['data.User'];
type LoginCredentials = components['schemas']['handlers.PostAuthRequest'];
type LoginResponse = components['schemas']['handlers.PostAuthResponse'];
type ErrorResponse = components['schemas']['handlers.ApiError'];

export interface SessionContextValue {
    session: UserData | null;
    sessionRefresh: () => Promise<unknown>;
    login: (credentials: LoginCredentials) => Promise<LoginResponse>;
    error: ErrorResponse | null;
    isLoading: boolean;
    logout: () => Promise<unknown>;
}

export const SessionContext = createContext<SessionContextValue | undefined>(
    undefined,
);

interface SessionProviderProps {
    children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
    const [session, setSession] = React.useState<UserData | null>(null);

    const deleteLogout = $api.useMutation('delete', '/auth/logout', {
        onSuccess: () => setSession(null),
    });

    const getUserByKey = $api.useQuery('get', '/user/me');

    React.useEffect(() => {
        if (getUserByKey.data) {
            setSession(getUserByKey.data);
        }
    }, [getUserByKey.data]);

    const loginMutation = $api.useMutation('post', '/auth/login', {
        onSuccess: async ({ token }) => {
            await setSessionToken(token);
            return getUserByKey.refetch();
        },
    });

    const login = async (credentials: LoginCredentials) => {
        return loginMutation.mutateAsync({ body: credentials });
    };

    const value: SessionContextValue = {
        session: session,
        sessionRefresh: getUserByKey.refetch,
        login: login,
        error: loginMutation.error,
        isLoading: getUserByKey.isLoading || loginMutation.isPending,
        logout: async () => deleteLogout.mutateAsync({}),
    };

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
}
