import {
    ClientBuilder,
    Client,
    type AuthMiddlewareOptions,
    type HttpMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
    host: process.env.CTP_AUTH_URL ?? '',
    projectKey: process.env.CTP_PROJECT_KEY ?? '',
    credentials: {
        clientId: process.env.CTP_CLIENT_ID ?? '',
        clientSecret: process.env.CTP_CLIENT_SECRET ?? '',
    },
    scopes: [process.env.CTP_SCOPES ?? ''],
    fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
    host: process.env.CTP_API_URL ?? '',
    fetch,
};

// Export the ClientBuilder
export const ctpClient: Client = new ClientBuilder()
    .withClientCredentialsFlow(authMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();

export const apiRoot: ByProjectKeyRequestBuilder = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
    projectKey: process.env.CTP_PROJECT_KEY ?? '',
});
