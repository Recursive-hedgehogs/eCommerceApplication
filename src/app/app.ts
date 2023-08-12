import { IApp, ICustomerData } from '../models/interfaces/interface';
import { Router } from '../router/router';
import View from '../view/view';
import { ROUTE } from '../models/enums/enum';
import Main, { main } from '../components/main/main';
import { apiCustomer } from '../api/api-customer';

class App implements IApp {
    public view: View | null;
    private router: Router;
    main: Main;

    constructor() {
        this.view = null;
        this.router = new Router();
        this.main = main;
    }

    public start(view: View): void {
        this.view = view;

        const customerData: ICustomerData = {
            addresses: [
                {
                    city: 'Katowice',
                    country: 'PL',
                    postalCode: '89',
                    streetName: 'Wolności',
                },
                {
                    city: 'Minsk',
                    country: 'BY',
                    postalCode: '89000',
                    streetName: 'Skaryny',
                },
            ],
            dateOfBirth: new Date().toISOString().split('T')[0],
            firstName: 'REW',
            lastName: 'Wer',
            email: 'baaera@gmail.com',
            password: '012345',
        };
        // console.log(customerData);
        // console.log(JSON.parse(JSON.stringify(customerData)));
        apiCustomer
            .createCustomer(customerData)
            .then((jhlk) => {
                console.log(jhlk);
            })
            .catch((err: Error) => alert(err.message));
    }

    setCurrentPage(route: string): void {
        if (this.view && this.view.pages) {
            const page: HTMLElement | undefined = this.view.pages.has(route)
                ? this.view.pages.get(route)
                : this.view.pages.get(ROUTE.NOT_FOUND);
            this.router.setCurrentPage();
            this.main.setContent(page);
        }
    }
}

export default App;
