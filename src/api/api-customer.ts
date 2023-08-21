import { ICreateCustomerCredentials, IEmailTokenCredentials, ILoginCredentials } from '../models/interfaces/interface';
import { apiRoot } from './api-client';
import { ApiPasswordFlow } from './api-password-flow';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { ApiRefreshTokenFlow } from './api-refresh-token-flow';
import { ApiExistingTokenFlow } from './api-existing-token-flow';

class ApiCustomer {
    private apiPasswordFlow: ApiPasswordFlow;
    private apiRefreshTokenFlow: ApiRefreshTokenFlow;
    private apiExistingTokenFlow: ApiExistingTokenFlow;
    constructor() {
        this.apiPasswordFlow = new ApiPasswordFlow();
        this.apiRefreshTokenFlow = new ApiRefreshTokenFlow();
        this.apiExistingTokenFlow = new ApiExistingTokenFlow();
    }
    createCustomer = (data: ICreateCustomerCredentials) => {
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

    createCustomer1 = (data: ICreateCustomerCredentials) => {
        this.apiPasswordFlow.setUserData(data.email, data.password);
        const apiRoot: ByProjectKeyRequestBuilder = this.apiPasswordFlow.apiRoot as ByProjectKeyRequestBuilder;
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

    // signIn = (data: ILoginCredentials) => {
    //     return apiRoot
    //         .login()
    //         .post({
    //             body: {
    //                 email: data.email,
    //                 password: data.password,
    //             },
    //         })
    //         .execute()
    //         .catch((err) => {
    //             throw Error(err);
    //         });
    // };

    signIn1 = (data: ILoginCredentials) => {
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

    signIn2 = (data: ILoginCredentials) => {
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

    createEmailToken = (data: IEmailTokenCredentials) => {
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

    public getUser() {
        console.log(this.apiExistingTokenFlow);
        this.apiExistingTokenFlow.apiRoot
            ?.customers()
            .withId({ ID: 'a7be1a82-d0e2-44ef-8363-07029e0cb796' })
            .get()
            .execute()
            .then((r) => console.log(r));
    }
}

export const apiCustomer: ApiCustomer = new ApiCustomer();
