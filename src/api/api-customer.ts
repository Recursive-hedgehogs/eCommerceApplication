import {
    ICreateCustomerCredentials,
    IEmailTokenCredentials,
    ILoginCredentials,
} from '../constants/interfaces/credentials.interface';
import { apiRoot } from './api-client';
import { ApiPasswordFlow } from './api-flows/api-password-flow';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { ApiRefreshTokenFlow } from './api-flows/api-refresh-token-flow';
import { ApiExistingTokenFlow } from './api-flows/api-existing-token-flow';

class ApiCustomer {
    private apiPasswordFlow: ApiPasswordFlow;
    private apiRefreshTokenFlow: ApiRefreshTokenFlow;
    private apiExistingTokenFlow: ApiExistingTokenFlow;
    constructor() {
        this.apiPasswordFlow = new ApiPasswordFlow();
        this.apiRefreshTokenFlow = new ApiRefreshTokenFlow();
        this.apiExistingTokenFlow = new ApiExistingTokenFlow();
    }
    public createCustomer = (data: ICreateCustomerCredentials) => {
        return apiRoot
            .customers()
            .post({
                body: data,
            })
            .execute()
            .catch((err) => {
                throw Error(err);
            });
    };

    public signIn = (data: ILoginCredentials) => {
        this.apiPasswordFlow.setUserData(data.email, data.password);
        const apiRoot: ByProjectKeyRequestBuilder = this.apiPasswordFlow.apiRoot as ByProjectKeyRequestBuilder;
        return apiRoot
            .login()
            .post({
                body: {
                    email: data.email,
                    password: data.password,
                },
            })
            .execute()
            .catch((err) => {
                throw Error(err);
            });
    };

    public signIn2 = (data: ILoginCredentials) => {
        const refresh = localStorage.getItem('refreshToken');
        if (refresh) {
            this.apiRefreshTokenFlow.setUserData(refresh);
            this.apiRefreshTokenFlow.apiRoot?.customers().get().execute();
        }
        const apiRoot: ByProjectKeyRequestBuilder = this.apiRefreshTokenFlow.apiRoot as ByProjectKeyRequestBuilder;
        return apiRoot
            .login()
            .post({
                body: {
                    email: data.email,
                    password: data.password,
                },
            })
            .execute()
            .catch((err) => {
                throw Error(err);
            });
    };

    public createEmailToken = (data: IEmailTokenCredentials) => {
        return apiRoot
            .customers()
            .emailToken()
            .post({
                body: data,
            })
            .execute()
            .catch((err) => {
                throw Error(err);
            });
    };

    public getUser = (ID: string) => {
        return this.apiExistingTokenFlow.apiRoot
            ?.customers()
            .withId({ ID })
            .get()
            .execute()
            .catch((err) => {
                throw Error(err);
            });
    };
}
export const apiCustomer: ApiCustomer = new ApiCustomer();
