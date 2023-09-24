import { ProductCard } from './product-card';
import { Router } from '../../router/router';
import { ROUTE } from '../../constants/enums/enum';
import App from '../../app/app';
import { ApiBasket } from '../../api/api-basket/api-basket';
import { Cart, ClientResponse } from '@commercetools/platform-sdk';
import { Spinner } from '../spinner/spinner';

export class ProductCardController {
    private readonly productCard: ProductCard;
    private readonly spinner: Spinner;
    private router: Router;
    private app: App;
    private apiBasket: ApiBasket = new ApiBasket();

    constructor(productCard: ProductCard) {
        this.app = new App();
        this.productCard = productCard;
        this.router = new Router();
        this.spinner = new Spinner();
        this.addListeners();
    }

    private addListeners(): void {
        this.productCard.element?.addEventListener('click', this.onClick);
    }

    public onClick = (e: Event): void => {
        const target: HTMLElement = e.target as HTMLElement;
        switch (target.id) {
            case 'add-product-to-cart':
                this.addProductToCart()?.then((): void => {
                    this.productCard.inCart = true;
                });
                break;
            default:
                this.router.navigate(`${ROUTE.PRODUCT}/${this.productCard.productId}`);
        }
    };

    public addProductToCart(): Promise<void> | undefined {
        this.productCard.element?.append(this.spinner.element as Node);
        return this.app.basketPage.getBasket()?.then((cart?: Cart): void => {
            if (cart) {
                this.apiBasket
                    .updateCart(cart.id, cart.version, this.productCard.productId)
                    ?.then(({ body }: ClientResponse<Cart>): void => {
                        this.app.basketPage.setContent(body);
                        this.app.header.setItemsNumInBasket(body.totalLineItemQuantity ?? 0);
                        this.productCard.element?.querySelector('.spinner-container')?.remove();
                    })
                    .catch(() => this.productCard.element?.querySelector('.spinner-container')?.remove());
            }
        });
    }
}
