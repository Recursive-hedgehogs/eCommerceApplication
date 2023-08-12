// import fetch from 'node-fetch';
import {
    ClientBuilder,
    Client,
    type AuthMiddlewareOptions,
    type HttpMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import {environment} from "../environment/environment";
import {
    ByProjectKeyRequestBuilder
} from "@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder";
import {createApiBuilderFromCtpClient} from "@commercetools/platform-sdk";

// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
    host: environment.authURL,
    projectKey: environment.projectKey,
    credentials: {
        clientId: environment.clientID,
        clientSecret: environment.clientSecret,
    },
    scopes: [
        environment.scope
    ],
    fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
    host: environment.apiURL,
    fetch,
};

// Export the ClientBuilder
export const ctpClient: Client = new ClientBuilder()
    .withClientCredentialsFlow(authMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();

export const apiRoot: ByProjectKeyRequestBuilder = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
    projectKey: environment.projectKey,
});