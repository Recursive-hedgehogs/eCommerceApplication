import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { PasswordAuthMiddlewareOptions } from '../models/types/type';
import { environment } from '../environment/environment';
import { Client, ClientBuilder, HttpMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import SdkAuth from '@commercetools/sdk-auth';
import { ApiExistingTokenFlow } from './api-existing-token-flow';
import { ITokenResponse } from '../models/interfaces/interface';
import { ApiRefreshTokenFlow } from './api-refresh-token-flow';

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
    private apiRefreshTokenFlow?: ApiRefreshTokenFlow;

    constructor() {
        this.apiExistingTokenFlow = new ApiExistingTokenFlow();
        this.apiRefreshTokenFlow = new ApiRefreshTokenFlow();
        return ApiPasswordFlow.singleton ?? (ApiPasswordFlow.singleton = this);
    }

    setUserData(email: string, password: string): void {
        const authClient = new SdkAuth({
            host: environment.authURL,
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
        authClient
            .customerPasswordFlow(
                {
                    username: email,
                    password,
                },
                {
                    disableRefreshToken: false,
                }
            )
            .then((resp: ITokenResponse): void => {
                localStorage.setItem('refreshToken', resp.refresh_token);
                this.apiRefreshTokenFlow?.setUserData(resp.refresh_token);
                this.apiExistingTokenFlow?.setUserData(resp.access_token);
            })
            .catch((err: Error) => console.log(err));
    }
}
