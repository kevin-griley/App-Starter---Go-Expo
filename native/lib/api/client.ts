import { getSessionToken } from '@/components/SessionProvider/store';
import type { paths } from '@/types/schema';
import { QueryClient } from '@tanstack/react-query';
import type { Middleware } from 'openapi-fetch';
import createFetchClient from 'openapi-fetch';
import createClient from 'openapi-react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const authMiddleware: Middleware = {
    async onRequest({ request }) {
        const token = await getSessionToken();
        if (token) {
            request.headers.set('Authorization', `Bearer ${token}`);
        }
        return request;
    },
};

const fetchClient = createFetchClient<paths>({
    baseUrl: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
    credentials: 'include',
});

fetchClient.use(authMiddleware);

export const $api = createClient(fetchClient);
