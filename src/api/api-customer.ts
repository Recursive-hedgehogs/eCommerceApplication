import { ICustomerData } from '../models/interfaces/interface';
import { apiRoot } from './api-client';

class ApiCustomer {
    createCustomer = (data: ICustomerData) => {
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
}

export const apiCustomer = new ApiCustomer();
