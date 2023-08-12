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
                },
            })
            .execute();
    };
}

export const apiCustomer = new ApiCustomer();
