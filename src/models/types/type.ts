import { TokenCache } from '@commercetools/sdk-client-v2';

export type PasswordAuthMiddlewareOptions = {
    host: string;
    projectKey: string;
    credentials: {
        clientId: string;
        clientSecret: string;
        user: {
            username: string;
            password: string;
        };
    };
    scopes?: Array<string>;
    tokenCache?: TokenCache;
    oauthUri?: string;
    fetch?: unknown;
};
