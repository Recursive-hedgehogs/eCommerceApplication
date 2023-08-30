import {
    AnonymousAuthMiddlewareOptions,
    Client,
    ClientBuilder,
    HttpMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import { environment } from '../../environment/environment';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';

export class ApiAnonymousSessionFlow {
    private static singleton: ApiAnonymousSessionFlow;
    private options: AnonymousAuthMiddlewareOptions = {
        host: environment.authURL,
        projectKey: environment.projectKey,
        credentials: {
            clientId: environment.clientID,
            clientSecret: environment.clientSecret,
        },
        scopes: [environment.scope],
        fetch,
    };
    private client?: Client;
    public apiRoot?: ByProjectKeyRequestBuilder;
    private httpMiddlewareOptions: HttpMiddlewareOptions = {
        host: environment.apiURL,
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
            projectKey: environment.projectKey,
        });
    }
}
