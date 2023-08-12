import {IApp} from '../models/interfaces/interface';
import { Router } from '../router/router';
import View from '../view/view';
import { ROUTE } from '../models/enums/enum';
import Main, { main } from '../components/main/main';

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



        // const customerData: ICustomerData = {email: 'neiwra@gmail.com', password: '012345'}
        // apiCustomer.createCustomer(customerData).then((jhlk)=> {console.log(jhlk)})
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
