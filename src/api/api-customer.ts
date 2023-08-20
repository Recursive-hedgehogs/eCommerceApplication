import {
    ICreateCustomerCredentials,
    IEmailTokenCredentials,
    ILoginCredentials,
    IPasswordResetTokenCredentials,
} from '../models/interfaces/interface';
import { apiRoot } from './api-client';

class ApiCustomer {
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

    signIn = (data: ILoginCredentials) => {
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
