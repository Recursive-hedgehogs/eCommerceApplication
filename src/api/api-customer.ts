import { ICreateCustomerCredentials, IEmailTokenCredentials, ILoginCredentials } from '../models/interfaces/interface';
import { apiRoot } from './api-client';

class ApiCustomer {
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
            .post({
                body: {
                    email: data.email,
                },
            })
            .execute()
            .catch((err) => {
                throw Error(err);
            });
    };
}

export const apiCustomer = new ApiCustomer();
