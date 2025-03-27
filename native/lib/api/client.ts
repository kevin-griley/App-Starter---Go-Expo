import type { paths } from '@/types/schema';
import { QueryClient } from '@tanstack/react-query';
import createFetchClient from 'openapi-fetch';
import createClient from 'openapi-react-query';

const fetchClient = createFetchClient<paths>({
    baseUrl: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
    credentials: 'include',
});

export const $api = createClient(fetchClient);

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});
