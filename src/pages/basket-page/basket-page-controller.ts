import App from '../../app/app';
import { ROUTE } from '../../constants/enums/enum';
import { Router } from '../../router/router';
import BasketPage from './basket-page';

export class BasketPageController {
    private basketPage: BasketPage;
    private app: App;
    private router: Router;

    constructor() {
        this.app = new App();
        this.basketPage = this.app.basketPage;
        this.router = new Router();
        this.addListeners();
    }

    private addListeners(): void {
        this.basketPage.element.addEventListener('click', this.goToCatalog);
    }

    private goToCatalog = (e: Event): void => {
        if (e.target instanceof HTMLElement && e.target.dataset.link === ROUTE.NOT_FOUND) {
            this.router.navigate(ROUTE.CATALOG);
        }
    };
}
