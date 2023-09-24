import {
    ICreateCustomerCredentials,
    IEmailTokenCredentials,
    ILoginCredentials,
} from '../constants/interfaces/credentials.interface';
import { apiRoot } from './api-client';
import { ApiPasswordFlow } from './api-flows/api-password-flow';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { ApiExistingTokenFlow } from './api-flows/api-existing-token-flow';
import { CustomerChangePassword, CustomerUpdate } from '@commercetools/platform-sdk';

class ApiCustomer {
    private apiPasswordFlow: ApiPasswordFlow;
    private apiExistingTokenFlow: ApiExistingTokenFlow;
    constructor() {
        this.apiPasswordFlow = new ApiPasswordFlow();
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

    public updateUser = (data: CustomerUpdate, ID: string) => {
        return this.apiExistingTokenFlow.apiRoot
            ?.customers()
            .withId({ ID })
            .post({
                body: data,
            })
            .execute()
            .catch((err) => {
                throw Error(err);
            });
    };

    public changePassword = (data: CustomerChangePassword) => {
        return this.apiExistingTokenFlow.apiRoot
            ?.customers()
            .password()
            .post({ body: data })
            .execute()
            .catch((err) => {
                throw Error(err.statusCode);
            });
    };
}
export const apiCustomer: ApiCustomer = new ApiCustomer();
