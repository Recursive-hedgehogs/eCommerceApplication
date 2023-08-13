import { Controllers } from '../../controllers/controllers';

export interface IView {
    build(): void;
}
export interface IApp {
    view: IView | null;
    start(view: IView, controllers: Controllers): void;
}

export interface IElementParams {
    tag: string;
    classNames: Array<string>;
    textContent?: string;
    innerHTML?: string;
}

export interface IAddress {
    country: string;
    city?: string;
    streetName?: string;
    postalCode?: string;
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
    email: string;
    id: string;
    ttlMinutes: number;
}
