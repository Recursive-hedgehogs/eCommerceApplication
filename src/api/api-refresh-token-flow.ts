import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { IRefreshAuthMiddlewareOptions } from '../constants/interfaces/interface';
import { environment } from '../environment/environment';
import { Client, ClientBuilder, HttpMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

export class ApiRefreshTokenFlow {
    private static singleton: ApiRefreshTokenFlow;
    private httpMiddlewareOptions: HttpMiddlewareOptions = {
        host: environment.apiURL,
        fetch,
    };
    private refreshAuthMiddlewareOptions: IRefreshAuthMiddlewareOptions = {
        host: environment.authURL,
        projectKey: environment.projectKey,
        credentials: {
            clientId: environment.clientID,
            clientSecret: environment.clientSecret,
        },
        refreshToken: '',
        scopes: [environment.scope],
        fetch,
    };
    private client?: Client;
    public apiRoot?: ByProjectKeyRequestBuilder;

    constructor() {
        return ApiRefreshTokenFlow.singleton ?? (ApiRefreshTokenFlow.singleton = this);
    }

    public setUserData(refreshToken: string): void {
        this.refreshAuthMiddlewareOptions.refreshToken = refreshToken;
        this.client = new ClientBuilder()
            .withHttpMiddleware(this.httpMiddlewareOptions)
            .withLoggerMiddleware()
            .withRefreshTokenFlow(this.refreshAuthMiddlewareOptions)
            .build();
        this.apiRoot = createApiBuilderFromCtpClient(this.client).withProjectKey({
            projectKey: environment.projectKey,
        });
    }
}
