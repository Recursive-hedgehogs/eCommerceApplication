import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { environment } from '../../environment/environment';
import {
    Client,
    ClientBuilder,
    ExistingTokenMiddlewareOptions,
    HttpMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

export class ApiExistingTokenFlow {
    private static singleton: ApiExistingTokenFlow;
    private httpMiddlewareOptions: HttpMiddlewareOptions = {
        host: environment.apiURL,
        fetch,
    };
    private authorization = '';
    private existingTokenMiddlewareOptions: ExistingTokenMiddlewareOptions = {
        force: true,
    };
    private client?: Client;
    public apiRoot?: ByProjectKeyRequestBuilder;
    constructor() {
        return ApiExistingTokenFlow.singleton ?? (ApiExistingTokenFlow.singleton = this);
    }

    public setUserData(token: string): void {
        this.authorization = `Bearer ${token}`;
        this.client = new ClientBuilder()
            .withHttpMiddleware(this.httpMiddlewareOptions)
            .withLoggerMiddleware()
            .withExistingTokenFlow(this.authorization, this.existingTokenMiddlewareOptions)
            .build();
        this.apiRoot = createApiBuilderFromCtpClient(this.client).withProjectKey({
            projectKey: environment.projectKey,
        });
    }
}
