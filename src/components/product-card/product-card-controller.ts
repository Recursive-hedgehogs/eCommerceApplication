import { ProductCard } from './product-card';
import { Router } from '../../router/router';
import { ROUTE } from '../../constants/enums/enum';
import App from '../../app/app';
import { ApiBasket } from '../../api/api-basket';
import { Cart, ClientResponse, MyCartDraft, ShoppingListUpdate } from '@commercetools/platform-sdk';

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
        this.productCard.productAddToCart.addEventListener('click', this.addProductToCart);
    }

    public onClick = (e: Event): void => {
        this.router.navigate(`${ROUTE.PRODUCT}/${this.productCard.productId}`);
        if (e.target) {
            this.app.productPage.getData(this.productCard.productId);
        }
    };

    public addProductToCart() {
        console.log('hjgjg');
        // this.createNewCart({currency : "EUR"});
        // this.updateShoppingList({
        //     version: 1,
        //     actions: [
        //         {
        //             action: 'addLineItem',
        //         },
        //     ],
        // }, 'acb58513-ccfd-4ee8-8f28-9b7238fb91cd');
    }

    public createNewCart(data: MyCartDraft) {
        this.apiBasket.createCart(data)?.then((resp: ClientResponse<Cart>) => console.log(resp));
    }

    public updateShoppingList(data: ShoppingListUpdate, ID: string) {
        this.apiBasket.updateShoppingListByID(data, ID)?.then((resp) => console.log(resp));
    }
}
