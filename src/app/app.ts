import { IApp } from '../constants/interfaces/interface';
import { Router } from '../router/router';
import View from '../view/view';
import { ROUTE } from '../constants/enums/enum';
import { iso31661, ISO31661AssignedEntry } from 'iso-3166';
import { Main } from '../components/main/main';
import LoginPage from '../pages/login-page/login-page';
import RegistrationPage from '../pages/registration-page/registration-page';
import ProductPage from '../pages/product-page/product-page';
import CatalogPage from '../pages/catalog-page/catalog-page';

class App implements IApp {
    private countriesArray: Array<ISO31661AssignedEntry>;
    private main: Main = new Main();
    private router: Router;
    private loggedIn = false;
    public view: View | null;
    public productPage: ProductPage;
    public catalogPage: CatalogPage;
    public loginPage: LoginPage;
    public registrationPage: RegistrationPage;

    constructor() {
        this.view = null;
        this.router = new Router();
        this.main = new Main();
        this.countriesArray = iso31661;
        this.loginPage = new LoginPage();
        this.registrationPage = new RegistrationPage();
        this.productPage = new ProductPage();
        this.catalogPage = new CatalogPage();
    }

    public start(view: View): void {
        this.view = view;
    }

    public setCurrentPage(route: string, isUpdate?: boolean): void {
        if (this.view && this.view.pages) {
            if (route === ROUTE.LOGIN && this.isAuthenticated()) {
                route = ROUTE.MAIN;
            }
            const page: HTMLElement | undefined = this.view.pages.has(route)
                ? this.view.pages.get(route)
                : this.view.pages.get(ROUTE.NOT_FOUND);
            this.router.setCurrentPage(route, isUpdate);
            this.main.setContent(page);
        }
    }

    public getCountryFromCode(code: string): string {
        return this.countriesArray.find((el: ISO31661AssignedEntry): boolean => el.alpha2 === code)?.name ?? '';
    }

    public getCodeFromCountryName(name: string): string {
        return this.countriesArray.find((el: ISO31661AssignedEntry): boolean => el.name === name)?.alpha2 ?? '';
    }

    public showMessage(text: string, color?: string): void {
        this.view?.showMessage(text, color);
    }

    public setAuthenticationStatus(status: boolean): void {
        this.loggedIn = status;
    }

    public isAuthenticated(): boolean {
        return this.loggedIn;
    }

    public setLocalStorage(key: string, value: unknown): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    public getDataFromLocalStorage(key: string): string | null {
        return localStorage.getItem(key);
    }

    public removeDataFromLocalStorage(key: string): void {
        localStorage.removeItem(key);
    }
}

export default App;
