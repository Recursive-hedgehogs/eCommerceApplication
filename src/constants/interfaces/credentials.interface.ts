import { IAddress } from './interface';

export interface IUser {
    username: string;
    password: string;
}

export interface IClientCredentials {
    clientId: string;
    clientSecret: string;
}

export interface IUserCredentials extends IClientCredentials {
    user: IUser;
}

export interface IAnonymusCredentials extends IClientCredentials {
    anonymousId?: string;
}

export interface ICreateCustomerCredentials {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    addresses: IAddress[];
}

export interface ILoginCredentials {
    email: string;
    password: string;
}

export interface IEmailTokenCredentials {
    id: string;
    ttlMinutes: number;
}
export interface IProductFiltersCredentials {
    filter?: string[];
    search?: string;
    sort?: string[];
}
