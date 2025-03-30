import { $api } from '@/lib/api/client';
import type { components } from '@/types/schema';
import * as SplashScreen from 'expo-splash-screen';
import type { ReactNode } from 'react';
import * as React from 'react';
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

export const SessionContext = React.createContext<
    SessionContextValue | undefined
>(undefined);

interface SessionProviderProps {
    children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
    const [session, setSession] = React.useState<UserData | null>(null);

    // Logout mutation
    const deleteLogout = $api.useMutation('delete', '/auth/logout');
    React.useEffect(() => {
        if (deleteLogout.status === 'success') {
            setSessionToken(null).then(() => {
                setSession(null);
            });
        }
    }, [deleteLogout.status]);

    // Fetch user data
    const getUserByKey = $api.useQuery('get', '/user/me');
    React.useEffect(() => {
        if (getUserByKey.isFetched) {
            SplashScreen.hideAsync();
        }
    }, [getUserByKey.status]);
    React.useEffect(() => {
        setSession(getUserByKey.data ?? null);
    }, [getUserByKey.data]);

    // Fetch token and trigger user data fetch
    const loginMutation = $api.useMutation('post', '/auth/login');
    React.useEffect(() => {
        if (loginMutation.status === 'success') {
            setSessionToken(loginMutation.data.token).then(() => {
                getUserByKey.refetch();
            });
        }
    }, [loginMutation.status]);

    // Login function
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
    const context = React.useContext(SessionContext);
    if (context === undefined) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
}
