import { IView } from '../constants/interfaces/interface';
import Header from '../components/header/header';
import { ROUTE } from '../constants/enums/enum';
import { Main } from '../components/main/main';
import App from '../app/app';
import { Message } from '../components/message/message';

class View implements IView {
    private _pages?: Map<string, HTMLElement>;
    private readonly main: Main;
    public app: App;

    constructor(app: App) {
        this.app = app;
        this.setPages();
        this.main = this.app.main;
        this.build();
    }

    public get pages() {
        return this._pages;
    }

    public build(): void {
        const header: HTMLElement = new Header().getElement();
        const mainElement: HTMLElement = this.main.getElement();
        document.body.append(header, mainElement);
    }

    public setPages(): void {
        const mainPage: HTMLElement = this.app.mainPage.getElement();
        const loginPage: HTMLElement = this.app.loginPage.getElement();
        const registrPage: HTMLElement = this.app.registrationPage.getElement();
        const catalogPage: HTMLElement = this.app.catalogPage.getElement();
        const productPage: HTMLElement = this.app.productPage.getElement();
        const notFoundPage: HTMLElement = this.app.notFoundPage.getElement();
        this._pages = new Map();
        this._pages.set(ROUTE.MAIN, mainPage);
        this._pages.set(ROUTE.LOGIN, loginPage);
        this._pages.set(ROUTE.REGISTRATION, registrPage);
        this._pages.set(ROUTE.PRODUCT, productPage);
        this._pages.set(ROUTE.CATALOG, catalogPage);
        this._pages.set(ROUTE.NOT_FOUND, notFoundPage);
    }

    public showMessage(text: string, color?: string): void {
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
