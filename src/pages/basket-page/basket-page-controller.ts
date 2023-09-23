import App from '../../app/app';
import { ROUTE } from '../../constants/enums/enum';
import { Router } from '../../router/router';
import BasketPage from './basket-page';
import { ApiBasket } from '../../api/api-basket/api-basket';

export class BasketPageController {
    public basketPage: BasketPage;
    private app: App;
    public router: Router;
    private apiBasket: ApiBasket;

    constructor() {
        this.app = new App();
        this.basketPage = this.app.basketPage;
        this.router = new Router();
        this.apiBasket = new ApiBasket();
        this.addListeners();
    }

    private addListeners(): void {
        this.basketPage.element.addEventListener('click', this.onClick);
        this.basketPage.element.addEventListener('submit', this.basketPage.onSubmitPromo);
    }

    public onClick = (e: Event): void => {
        if (e.target instanceof HTMLElement && e.target.dataset.link === ROUTE.NOT_FOUND) {
            this.router.navigate(ROUTE.CATALOG);
        }
        if (e.target instanceof HTMLElement && e.target.id === 'clear-cart') {
            this.basketPage.clearBasket();
        }
    };

    // private onSubmitPromo = (e: SubmitEvent) => {
    //     const promoInput = this.basketPage.element.querySelector('#promo') as HTMLInputElement;
    //     e.preventDefault();
    //     this.apiBasket
    //         .addDiscountCodeToCart(this.basketPage.cart!.id, this.basketPage.cart!.version, promoInput.value)
    //         ?.then((resp) => {
    //             console.log(resp);
    //         })
    //         .catch(() => {
    //             alert('Wrong code');
    //         });
    //     console.log('ggggg');
    // };
}
