import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { IRefreshAuthMiddlewareOptions } from '../../constants/interfaces/interface';
import { Client, ClientBuilder, HttpMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

export class ApiRefreshTokenFlow {
    private static singleton: ApiRefreshTokenFlow;
    private httpMiddlewareOptions: HttpMiddlewareOptions = {
        host: process.env.CTP_API_URL ?? '',
        fetch,
    };
    private refreshAuthMiddlewareOptions: IRefreshAuthMiddlewareOptions = {
        host: process.env.CTP_AUTH_URL ?? '',
        projectKey: process.env.CTP_PROJECT_KEY ?? '',
        credentials: {
            clientId: process.env.CTP_CLIENT_ID ?? '',
            clientSecret: process.env.CTP_CLIENT_SECRET ?? '',
        },
        refreshToken: '',
        scopes: [process.env.CTP_SCOPES ?? ''],
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
            projectKey: process.env.CTP_PROJECT_KEY ?? '',
        });
    }
}
