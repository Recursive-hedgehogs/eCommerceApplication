import { IApp } from '../models/interfaces/interface';
import { Router } from '../router/router';
import View from '../view/view';
import { ROUTE } from '../models/enums/enum';

import { iso31661, ISO31661AssignedEntry } from 'iso-3166';
import LoginPage from '../pages/login-page/login-page';
import { Main } from '../components/main/main';

class App implements IApp {
    private countriesArray: Array<ISO31661AssignedEntry>;
    public view: View | null;
    private main: Main = new Main();
    private router: Router;
    public loginPage: LoginPage;
    private loggedIn = false;

    constructor() {
        this.view = null;
        this.router = new Router();
        this.main = new Main();
        this.countriesArray = iso31661;
        this.loginPage = new LoginPage();
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

    public showMessage(text: string): void {
        this.view?.showMessage(text);
    }

    public setAuthenticationStatus(status: boolean): void {
        this.loggedIn = status;
    }

    public isAuthenticated(): boolean {
        return this.loggedIn;
    }
}

export default App;
