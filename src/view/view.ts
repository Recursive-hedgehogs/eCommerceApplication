import { IApp, IView } from '../models/interfaces/interface';
import LoginPage from '../pages/login-page/login-page';
import Header from '../components/header/header';
import MainPage from '../pages/main-page/main-page';
import NotFoundPage from '../pages/not-found-page/not-found-page';
import { ROUTE } from '../models/enums/enum';
import Main from '../components/main/main';
import App from '../app/app';

class View implements IView {
    public app: App | null;
    private _pages?: Map<string, HTMLElement>;

    constructor() {
        this.app = null;
        this.setPages();
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
        const main: HTMLElement = new Main().getElement();
        document.body.append(header, main);
    }

    setPages(): void {
        const mainPage: HTMLElement = new MainPage().getElement();
        const loginPage: HTMLElement = new LoginPage().getElement();
        const notFoundPage: HTMLElement = new NotFoundPage().getElement();
        this._pages = new Map();
        this._pages.set(ROUTE.MAIN, mainPage);
        this._pages.set(ROUTE.LOGIN, loginPage);
        this._pages.set(ROUTE.NOT_FOUND, notFoundPage);
    }
}

export default View;
