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
        // this.productCard.element?.addEventListener('click', this.onClick);
        this.productCard.productAddToCart.addEventListener('click', this.addProductToCart);
    }

    public onClick = (e: Event): void => {
        this.router.navigate(`${ROUTE.PRODUCT}/${this.productCard.productId}`);
        if (e.target) {
            this.app.productPage.getData(this.productCard.productId);
        }
    };

    public addProductToCart = () => {
        this.apiBasket
            .createCart({ currency: 'EUR' })
            ?.then(({ body }) => {
                this.apiBasket.updateCart(body.id, body.version, this.productCard.productId);
                console.log(body);
            })
            .then((resp) => console.log(resp));
    };
}
