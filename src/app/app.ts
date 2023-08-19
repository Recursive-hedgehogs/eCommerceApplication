import { IApp } from '../models/interfaces/interface';
import { Router } from '../router/router';
import View from '../view/view';
import { ROUTE } from '../models/enums/enum';
import Main, { main } from '../components/main/main';
import { iso31661, ISO31661AssignedEntry } from 'iso-3166';
import LoginPage from '../pages/login-page/login-page';

class App implements IApp {
    private countriesArray: Array<ISO31661AssignedEntry>;
    public view: View | null;
    public main: Main;
    private router: Router;
    public loginPage: LoginPage;

    constructor() {
        this.view = null;
        this.router = new Router();
        this.main = main;
        this.countriesArray = iso31661;
        this.loginPage = new LoginPage();
    }

    public start(view: View): void {
        this.view = view;
    }

    public setCurrentPage(route: string, isUpdate?: boolean): void {
        if (this.view && this.view.pages) {
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
}

export default App;
