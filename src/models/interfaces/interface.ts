import { Controllers } from '../../controllers/controllers';
import { TokenCache } from '@commercetools/sdk-client-v2';
import { IClientCredentials, IUserCredentials } from './credentials.interface';

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

export interface IPasswordAuthMiddlewareOptions {
    host: string;
    projectKey: string;
    credentials: IUserCredentials;
    scopes?: Array<string>;
    tokenCache?: TokenCache;
    oauthUri?: string;
    fetch?: unknown;
}

export interface IRefreshAuthMiddlewareOptions {
    host: string;
    projectKey: string;
    credentials: IClientCredentials;
    refreshToken: string;
    scopes?: Array<string>;
    tokenCache?: TokenCache;
    oauthUri?: string;
    fetch?: unknown;
}
