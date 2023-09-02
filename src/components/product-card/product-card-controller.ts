import { ProductCard } from './product-card';
import { Router } from '../../router/router';
import { ROUTE } from '../../constants/enums/enum';
import { ApiProduct } from '../../api/api-products/api-products';
import App from '../../app/app';
import { ClientResponse, Price, ProductDiscount } from '@commercetools/platform-sdk';

export class ProductCardController {
    private readonly productCard: ProductCard;
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

    private addListeners(): void {
        this.productCard.element?.addEventListener('click', this.onClick);
    }

    public onClick = (e: Event): void => {
        console.log(this.productCard);
        this.router.navigate(ROUTE.PRODUCT);
        if (e.target) {
            this.apiProduct
                .getProductById(this.productCard.productId)
                ?.then((resp) => resp.body)
                .then(async (product) => {
                    const a: Price[] | undefined = product.masterData.current.masterVariant.prices;
                    const b: string | undefined =
                        a && a[0] && a[0].discounted?.discount.id ? a[0].discounted?.discount.id : '';
                    try {
                        const discountResponse: ClientResponse<ProductDiscount> | undefined =
                            await this.apiProduct.getProductDiscountById(b);
                        const discount: ProductDiscount | undefined = discountResponse?.body;
                        return { product, discount };
                    } catch {
                        return { product };
                    }
                })
                .then((resp) => {
                    console.log(resp);
                    this.app?.productPage.retrieveContent(resp);
                    this.app?.productPage.setContent();
                });
        }
    };
}
