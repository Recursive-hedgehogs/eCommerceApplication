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
        this.basketPage.element.addEventListener('click', this.onClick);
        this.basketPage.element.addEventListener('submit', this.basketPage.onSubmitPromo);
    }

    private onClick = (e: Event): void => {
        if (e.target instanceof HTMLElement && e.target.dataset.link === ROUTE.NOT_FOUND) {
            this.router.navigate(ROUTE.CATALOG);
        }
        if (e.target instanceof HTMLElement && e.target.id === 'clear-cart') {
            this.basketPage.clearBasket();
        }
    };
}
