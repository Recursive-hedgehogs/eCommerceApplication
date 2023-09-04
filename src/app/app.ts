import { IApp } from '../constants/interfaces/interface';
import View from '../view/view';
import { iso31661, ISO31661AssignedEntry } from 'iso-3166';
import { Main } from '../components/main/main';
import LoginPage from '../pages/login-page/login-page';
import RegistrationPage from '../pages/registration-page/registration-page';
import ProductPage from '../pages/product-page/product-page';
import CatalogPage from '../pages/catalog-page/catalog-page';
import MainPage from '../pages/main-page/main-page';
import NotFoundPage from '../pages/not-found-page/not-found-page';
import UserPage from '../pages/user-page/user-page';
import Header from '../components/header/header';

class App implements IApp {
    private countriesArray!: Array<ISO31661AssignedEntry>;
    public main: Main = new Main();
    private loggedIn = false;
    public view!: View | null;
    public productPage!: ProductPage;
    public catalogPage!: CatalogPage;
    public loginPage!: LoginPage;
    public registrationPage!: RegistrationPage;
    public mainPage!: MainPage;
    public userPage!: UserPage;
    public notFoundPage!: NotFoundPage;
    public header!: Header;
    private static singleton: App;

    constructor() {
        if (App.singleton) {
            return App.singleton;
        }
        this.view = null;
        this.main = new Main();
        this.header = new Header();
        this.countriesArray = iso31661;
        this.mainPage = new MainPage();
        this.userPage = new UserPage();
        this.loginPage = new LoginPage();
        this.registrationPage = new RegistrationPage();
        this.productPage = new ProductPage();
        this.catalogPage = new CatalogPage();
        this.notFoundPage = new NotFoundPage();
        App.singleton = this;
    }

    public start(view: View): void {
        this.view = view;
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
}

export default App;
