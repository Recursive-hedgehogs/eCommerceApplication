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

export interface ICustomerData {
    email: string;
    password: string;
}
