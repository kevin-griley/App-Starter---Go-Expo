/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    '/auth/login': {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Retrive token for bearer authentication
         * @description Retrive token for bearer authentication
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            /** @description Login Request */
            requestBody: {
                content: {
                    'application/json': components['schemas']['handlers.PostAuthRequest'];
                };
            };
            responses: {
                /** @description Token Response */
                200: {
                    headers: Record<string, unknown>;
                    content: {
                        'application/json': components['schemas']['handlers.PostAuthResponse'];
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: Record<string, unknown>;
                    content: {
                        'application/json': components['schemas']['handlers.ApiError'];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: Record<string, unknown>;
                    content: {
                        'application/json': components['schemas']['handlers.ApiError'];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    '/auth/logout': {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Removes HttpOnly cookie from client
         * @description Removes HttpOnly cookie from client
         */
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: Record<string, unknown>;
                    content: {
                        'application/json': string;
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    '/auth/reset/confirm': {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Confirms a password reset
         * @description Confirms a password reset
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            /** @description Reset Confirm */
            requestBody: {
                content: {
                    'application/json': components['schemas']['handlers.PostAuthResetConfirm'];
                };
            };
            responses: {
                /** @description User */
                200: {
                    headers: Record<string, unknown>;
                    content: {
                        'application/json': components['schemas']['data.User'];
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: Record<string, unknown>;
                    content: {
                        'application/json': components['schemas']['handlers.ApiError'];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    '/auth/reset/request': {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Requests a password reset
         * @description Requests a password reset
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            /** @description Reset Request */
            requestBody: {
                content: {
                    'application/json': components['schemas']['handlers.PostAuthResetRequest'];
                };
            };
            responses: {
                /** @description User */
                200: {
                    headers: Record<string, unknown>;
                    content: {
                        'application/json': components['schemas']['data.User'];
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: Record<string, unknown>;
                    content: {
                        'application/json': components['schemas']['handlers.ApiError'];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    '/organization': {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create a new organization
         * @description Create a new organization
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            /** @description Create Organization Request */
            requestBody: {
                content: {
                    'application/json': components['schemas']['handlers.PostOrganizationRequest'];
                };
            };
            responses: {
                /** @description Organization */
                200: {
                    headers: Record<string, unknown>;
                    content: {
                        'application/json': components['schemas']['data.Organization'];
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: Record<string, unknown>;
                    content: {
                        'application/json': components['schemas']['handlers.ApiError'];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    '/organization/{ID}': {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get organization by ID
         * @description Get organization by ID
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Organization ID */
                    ID: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Organization */
                200: {
                    headers: Record<string, unknown>;
                    content: {
                        'application/json': components['schemas']['data.Organization'];
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: Record<string, unknown>;
                    content: {
                        'application/json': components['schemas']['handlers.ApiError'];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Patch organization by ID
         * @description Patch organization by ID
         */
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Organization ID */
                    id: string;
                };
                cookie?: never;
            };
            /** @description Patch Organization Request */
            requestBody: {
                content: {
                    'application/json': components['schemas']['handlers.PatchOrganizationRequest'];
                };
            };
            responses: {
                /** @description Organization */
                200: {
                    headers: Record<string, unknown>;
                    content: {
                        'application/json': components['schemas']['data.Organization'];
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: Record<string, unknown>;
                    content: {
                        'application/json': components['schemas']['handlers.ApiError'];
                    };
                };
            };
        };
        trace?: never;
    };
    '/user': {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create a new user
         * @description Create a new user
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            /** @description Create User Request */
            requestBody: {
                content: {
                    'application/json': components['schemas']['handlers.PostUserRequest'];
                };
            };
            responses: {
                /** @description User */
                200: {
                    headers: Record<string, unknown>;
                    content: {
                        'application/json': components['schemas']['data.User'];
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: Record<string, unknown>;
                    content: {
                        'application/json': components['schemas']['handlers.ApiError'];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    '/user/me': {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get user by apiKey
         * @description Get user by apiKey
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description User */
                200: {
                    headers: Record<string, unknown>;
                    content: {
                        'application/json': components['schemas']['data.User'];
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: Record<string, unknown>;
                    content: {
                        'application/json': components['schemas']['handlers.ApiError'];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Patch user by apiKey
         * @description Patch user by apiKey
         */
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            /** @description Patch User Request */
            requestBody: {
                content: {
                    'application/json': components['schemas']['handlers.PatchUserRequest'];
                };
            };
            responses: {
                /** @description User */
                200: {
                    headers: Record<string, unknown>;
                    content: {
                        'application/json': components['schemas']['data.User'];
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: Record<string, unknown>;
                    content: {
                        'application/json': components['schemas']['handlers.ApiError'];
                    };
                };
            };
        };
        trace?: never;
    };
    '/user_associations/me': {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get associations by apiKey
         * @description Get associations by apiKey
         */
        get: {
            parameters: {
                query?: {
                    /** @description Allowed: ['organizations'] */
                    expand?: string[];
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Associations */
                200: {
                    headers: Record<string, unknown>;
                    content: {
                        'application/json': components['schemas']['data.Association'][];
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: Record<string, unknown>;
                    content: {
                        'application/json': components['schemas']['handlers.ApiError'];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        'data.Association': {
            created_at?: string;
            id?: string;
            organization?: components['schemas']['data.Organization'];
            organization_id?: string;
            permissions?: components['schemas']['data.PermissionsEnum'][];
            status?: components['schemas']['data.OrganizationStatus'];
            updated_at?: string;
            user_id?: string;
        };
        'data.Organization': {
            address?: string;
            contact_info?: string;
            created_at?: string;
            id?: string;
            is_deleted?: boolean;
            name?: string;
            organization_type?: components['schemas']['data.OrganizationType'];
            unique_url?: string;
            updated_at?: string;
        };
        /** @enum {string} */
        'data.OrganizationStatus': 'pending' | 'active' | 'inactive';
        /** @enum {string} */
        'data.OrganizationType': 'airline' | 'carrier' | 'warehouse';
        /** @enum {string} */
        'data.PermissionsEnum':
            | 'user.read'
            | 'user.write'
            | 'organization.read'
            | 'organization.write'
            | 'manifest.read'
            | 'manifest.write'
            | 'uld.read'
            | 'uld.write';
        'data.User': {
            created_at?: string;
            email?: string;
            id?: string;
            updated_at?: string;
            user_name?: string;
        };
        'handlers.ApiError': {
            error?: string;
            status?: number;
        };
        'handlers.PatchOrganizationRequest': Record<string, never>;
        'handlers.PatchUserRequest': {
            password?: string;
            user_name?: string;
        };
        'handlers.PostAuthRequest': {
            email?: string;
            password?: string;
        };
        'handlers.PostAuthResetConfirm': {
            confirm_code?: string;
            new_password?: string;
        };
        'handlers.PostAuthResetRequest': {
            email?: string;
        };
        'handlers.PostAuthResponse': {
            token?: string;
        };
        'handlers.PostOrganizationRequest': {
            address?: string;
            contact_info?: string;
            name?: string;
            organization_type?: components['schemas']['data.OrganizationType'];
        };
        'handlers.PostUserRequest': {
            email?: string;
            password?: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
