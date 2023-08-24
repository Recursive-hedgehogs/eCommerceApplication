import { IView } from '../models/interfaces/interface';
import LoginPage from '../pages/login-page/login-page';
import Header from '../components/header/header';
import MainPage from '../pages/main-page/main-page';
import NotFoundPage from '../pages/not-found-page/not-found-page';
import { ROUTE } from '../models/enums/enum';
import { Main } from '../components/main/main';
import App from '../app/app';
import RegistrationPage from '../pages/registration-page/registration-page';
import Message from '../components/message/message';
import ProductPage from '../pages/product-page/product-page';

class View implements IView {
    public app: App | null;
    private _pages?: Map<string, HTMLElement>;
    private readonly main: Main;

    constructor() {
        this.app = null;
        this.setPages();
        this.main = new Main();
    }

    public get pages() {
        return this._pages;
    }

    public start(app: App): void {
        this.app = app;
        this.build();
    }

    public build(): void {
        const header: HTMLElement = new Header().getElement();
        const mainElement: HTMLElement = this.main.getElement();
        document.body.append(header, mainElement);
    }

    setPages(): void {
        const mainPage: HTMLElement = new MainPage().getElement();
        const loginPage: HTMLElement = new LoginPage().getElement();
        const registrPage: HTMLElement = new RegistrationPage().getElement();
        const productPage: HTMLElement = new ProductPage().getElement();
        const notFoundPage: HTMLElement = new NotFoundPage().getElement();
        this._pages = new Map();
        this._pages.set(ROUTE.MAIN, mainPage);
        this._pages.set(ROUTE.LOGIN, loginPage);
        this._pages.set(ROUTE.REGISTRATION, registrPage);
        this._pages.set(ROUTE.PRODUCT, productPage);
        this._pages.set(ROUTE.NOT_FOUND, notFoundPage);
    }

    showMessage(text: string, color?: string): void {
        const message: Message = new Message(text);
        if (message.element) {
            this.main?.getElement()?.after(message.element);
        }
        if (color) {
            message.element?.classList.add('bg-warning');
        }
        setTimeout(() => document.querySelector('.message')?.remove(), 4000);
    }
}

export default View;
