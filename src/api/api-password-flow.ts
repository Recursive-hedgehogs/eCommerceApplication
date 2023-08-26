import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { IPasswordAuthMiddlewareOptions } from '../constants/interfaces/interface';
import { environment } from '../environment/environment';
import { Client, ClientBuilder, HttpMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import SdkAuth from '@commercetools/sdk-auth';
import { ApiExistingTokenFlow } from './api-existing-token-flow';
import { ITokenResponse } from '../constants/interfaces/response.interface';
import { ApiRefreshTokenFlow } from './api-refresh-token-flow';

export class ApiPasswordFlow {
    private static singleton: ApiPasswordFlow;
    private httpMiddlewareOptions: HttpMiddlewareOptions = {
        host: environment.apiURL,
        fetch,
    };
    private passwordAuthMiddlewareOptions: IPasswordAuthMiddlewareOptions = {
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
    private apiExistingTokenFlow?: ApiExistingTokenFlow;
    private apiRefreshTokenFlow?: ApiRefreshTokenFlow;
    public apiRoot?: ByProjectKeyRequestBuilder;

    constructor() {
        this.apiExistingTokenFlow = new ApiExistingTokenFlow();
        this.apiRefreshTokenFlow = new ApiRefreshTokenFlow();
        return ApiPasswordFlow.singleton ?? (ApiPasswordFlow.singleton = this);
    }

    public setUserData(email: string, password: string): void {
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
