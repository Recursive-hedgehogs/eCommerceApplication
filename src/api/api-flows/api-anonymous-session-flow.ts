import {
    AnonymousAuthMiddlewareOptions,
    Client,
    ClientBuilder,
    HttpMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';

export class ApiAnonymousSessionFlow {
    private static singleton: ApiAnonymousSessionFlow;
    private options: AnonymousAuthMiddlewareOptions = {
        host: process.env.CTP_AUTH_URL ?? '',
        projectKey: process.env.CTP_PROJECT_KEY ?? '',
        credentials: {
            clientId: process.env.CTP_CLIENT_ID ?? '',
            clientSecret: process.env.CTP_CLIENT_SECRET ?? '',
        },
        scopes: [process.env.CTP_SCOPES ?? ''],
        fetch,
    };
    private client?: Client;
    public apiRoot?: ByProjectKeyRequestBuilder;
    private httpMiddlewareOptions: HttpMiddlewareOptions = {
        host: process.env.CTP_API_URL ?? '',
        fetch,
    };

    constructor() {
        if (ApiAnonymousSessionFlow.singleton) {
            return ApiAnonymousSessionFlow.singleton;
        }
        this.start();
        ApiAnonymousSessionFlow.singleton = this;
    }

    public start(): void {
        this.client = new ClientBuilder()
            .withAnonymousSessionFlow(this.options)
            .withHttpMiddleware(this.httpMiddlewareOptions)
            .withLoggerMiddleware()
            .build();
        this.apiRoot = createApiBuilderFromCtpClient(this.client).withProjectKey({
            projectKey: process.env.CTP_PROJECT_KEY ?? '',
        });
    }
}
