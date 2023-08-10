import { IApp, IView } from '../models/interfaces/interface';
import LoginPage from '../pages/login-page/login-page';
import Header from '../components/header/header';
import MainPage from '../pages/main-page/main-page';
import ElementCreator from '../utils/template-creation';
import NotFoundPage from "../pages/not-found-page/not-found-page";
import {ROUTE} from "../models/enums/enum";

class View implements IView {
    public model: IApp | null;
    private main: ElementCreator<HTMLElement>;
    private _pages?: Map<string, HTMLElement>;

    constructor(main: ElementCreator<HTMLElement>) {
        this.main = main;
        this.model = null;
        this.setPages();
    }

    public get pages() {
        return this._pages;
    }

    public start(model: IApp): void {
        this.model = model;
    }

    public build(): void {
        const header: HTMLElement = new Header().getElement();
        document.body.append(header, this.main.getElement());
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
