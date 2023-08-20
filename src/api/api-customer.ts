import {
    ICreateCustomerCredentials,
    IEmailTokenCredentials,
    ILoginCredentials,
    IPasswordResetTokenCredentials,
} from '../models/interfaces/interface';
import { apiRoot } from './api-client';
import { Api } from './api';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';

class ApiCustomer {
    private api: Api;
    constructor() {
        this.api = new Api();
    }
    createCustomer = (data: ICreateCustomerCredentials) => {
        return apiRoot
            .customers()
            .post({
                body: {
                    email: data.email,
                    password: data.password,
                    dateOfBirth: data.dateOfBirth,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    addresses: data.addresses,
                },
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
        this.api.setUserData(data.email, data.password);
        const apiRoot = this.api.apiRoot as ByProjectKeyRequestBuilder;
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

    createPasswordToken = (data: IPasswordResetTokenCredentials) => {
        return apiRoot
            .customers()
            .passwordToken()
            .post({
                body: data,
            })
            .execute()
            .catch((err) => {
                throw Error(err);
            });
    };
}

export const apiCustomer: ApiCustomer = new ApiCustomer();
