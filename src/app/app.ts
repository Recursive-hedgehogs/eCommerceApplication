import { IApp } from '../models/interfaces/interface';
import { Router } from '../router/router';
import View from '../view/view';
import { ROUTE } from '../models/enums/enum';
import Main, { main } from '../components/main/main';
import { apiCustomer } from '../api/api-customer';
import { iso31661, ISO31661AssignedEntry } from 'iso-3166';

class App implements IApp {
    private countriesArray: Array<ISO31661AssignedEntry>;
    public view: View | null;
    public main: Main;
    private router: Router;

    constructor() {
        this.view = null;
        this.router = new Router();
        this.main = main;
        this.countriesArray = iso31661;
    }

    public start(view: View): void {
        this.view = view;

        apiCustomer
            .signIn({ email: 'baaera@gmail.com', password: '012345' })
            .then((resp) => {
                const customer = resp.body.customer;
                return apiCustomer.createEmailToken({ id: customer.id, ttlMinutes: 2 });
            })
            .then((response) => {
                console.log(response);
            })
            .catch((err: Error) => alert(err.message));
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
