import { ProductCard } from './product-card';
import { Router } from '../../router/router';
import { ROUTE } from '../../constants/enums/enum';
import { ApiProduct } from '../../api/products/api-products';
import App from '../../app/app';

export class ProductCardController {
    private productCard: ProductCard;
    private router: Router;
    private apiProduct: ApiProduct;
    private app: App;
    constructor(productCard: ProductCard) {
        this.app = new App();
        this.productCard = productCard;
        this.addListeners();
        this.router = new Router();
        this.apiProduct = new ApiProduct();
    }

    private addListeners() {
        this.productCard.element?.addEventListener('click', this.onClick);
    }

    public onClick = (e: Event) => {
        console.log(this.productCard);
        this.router.navigate(ROUTE.PRODUCT);
        if (e.target && this.productCard.productKey) {
            this.apiProduct.getProductByKey(this.productCard.productKey)?.then((resp) => {
                console.log(this.app, 'jytgjhgjhghjghj', resp);
                this.app?.productPage.setContent(resp.body);
            });
        }
    };
}
