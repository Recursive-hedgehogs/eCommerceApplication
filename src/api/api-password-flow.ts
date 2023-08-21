import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { PasswordAuthMiddlewareOptions } from '../models/types/type';
import { environment } from '../environment/environment';
import { Client, ClientBuilder, HttpMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import SdkAuth from '@commercetools/sdk-auth';
import { ApiExistingTokenFlow } from './api-existing-token-flow';

export class ApiPasswordFlow {
    private static singleton: ApiPasswordFlow;
    public apiRoot?: ByProjectKeyRequestBuilder;
    httpMiddlewareOptions: HttpMiddlewareOptions = {
        host: environment.apiURL,
        fetch,
    };

    passwordAuthMiddlewareOptions: PasswordAuthMiddlewareOptions = {
        host: environment.authURL,
        projectKey: environment.projectKey,
        credentials: {
            clientId: environment.clientID,
            clientSecret: environment.clientSecret,
            user: {
                username: '',
                password: '',
            },
        },
        scopes: [environment.scope],
        fetch,
    };
    private client?: Client;
    public token?: string;
    private apiExistingTokenFlow?: ApiExistingTokenFlow;

    constructor() {
        this.apiExistingTokenFlow = new ApiExistingTokenFlow();
        return ApiPasswordFlow.singleton ?? (ApiPasswordFlow.singleton = this);
    }

    async setUserData(email: string, password: string) {
        const authClient = new SdkAuth({
            host: 'https://auth.commercetools.com',
            projectKey: environment.projectKey,
            disableRefreshToken: false,
            credentials: {
                clientId: environment.clientID,
                clientSecret: environment.clientSecret,
            },
            scopes: [environment.scope],
            fetch,
        });
        this.passwordAuthMiddlewareOptions.credentials.user.password = password;
        this.passwordAuthMiddlewareOptions.credentials.user.username = email;
        this.client = new ClientBuilder()
            .withHttpMiddleware(this.httpMiddlewareOptions)
            .withLoggerMiddleware()
            .withPasswordFlow(this.passwordAuthMiddlewareOptions)
            .build();
        this.apiRoot = createApiBuilderFromCtpClient(this.client).withProjectKey({
            projectKey: environment.projectKey,
        });
        const a = await authClient.customerPasswordFlow(
            {
                username: email,
                password,
            },
            {
                disableRefreshToken: false,
            }
        );
        localStorage.setItem('refreshToken', a.refresh_token);

        this.token = a.token;
        this.apiExistingTokenFlow?.setUserData(a.access_token);
        console.log(a);
        console.log(this.apiExistingTokenFlow, '!!!!!!!');
    }
}
