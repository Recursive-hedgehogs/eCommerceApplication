import { ProductCard } from './product-card';
import { Router } from '../../router/router';
import { ROUTE } from '../../constants/enums/enum';
import App from '../../app/app';
import { ApiBasket } from '../../api/api-basket';

export class ProductCardController {
    private readonly productCard: ProductCard;
    private router: Router;
    private app: App;
    private apiBasket: ApiBasket = new ApiBasket();

    constructor(productCard: ProductCard) {
        this.app = new App();
        this.productCard = productCard;
        this.addListeners();
        this.router = new Router();
    }

    private addListeners(): void {
        this.productCard.element?.addEventListener('click', this.onClick);
    }

    public onClick = (e: Event): void => {
        const target = e.target as HTMLElement;
        switch (target.id) {
            case 'add-product-to-cart':
                this.addProductToCart();
                break;
            default:
                this.router.navigate(`${ROUTE.PRODUCT}/${this.productCard.productId}`);
                this.app.productPage.getData(this.productCard.productId);
        }
    };

    public addProductToCart() {
        this.app.basketPage.getBasket()?.then((cart) => {
            if (cart) {
                this.apiBasket.updateCart(cart.id, cart.version, this.productCard.productId)?.then(({ body }) => {
                    this.app.basketPage.setContent(body);
                    this.app?.header.setItemsNumInBasket(cart?.lineItems.length + 1);
                });

                console.log(cart);
            }
        });
    }

    // getBasket() {
    //     return this.apiBasket
    //         .getCarts()
    //         ?.then((resp) => resp.body)
    //         .then((resp) => resp.results)
    //         .then((resp) => resp[0])
    //         .then((cart) => {
    //             if (cart?.id) {
    //                 return cart;
    //             } else {
    //                 return this.apiBasket.createCart();
    //             }
    //         });
    // }
}
