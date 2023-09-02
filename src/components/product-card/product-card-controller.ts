import { ProductCard } from './product-card';
import { Router } from '../../router/router';
import { ROUTE } from '../../constants/enums/enum';
import App from '../../app/app';

export class ProductCardController {
    private readonly productCard: ProductCard;
    private router: Router;
    private app: App;

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
        console.log(this.productCard);
        this.router.navigate(`${ROUTE.PRODUCT}/${this.productCard.productId}`);
        if (e.target) {
            this.app.productPage.getData(this.productCard.productId);
        }
    };
}
