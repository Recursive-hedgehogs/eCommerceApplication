import MainPage from './main-page';
import { ROUTE } from '../../constants/enums/enum';
import {
    ClientResponse,
    Price,
    Product,
    ProductDiscount,
    ProductPagedQueryResponse,
} from '@commercetools/platform-sdk';
import App from '../../app/app';
import { ApiProduct } from '../../api/products/api-products';
import { Router } from '../../router/router';

export class MainPageController {
    private app: App;
    private apiProduct: ApiProduct;
    private router: Router;
    private mainPage: MainPage;

    constructor() {
        this.app = new App();
        this.router = new Router();
        this.mainPage = this.app.mainPage;
        this.apiProduct = new ApiProduct();
        this.addListeners();
    }

    addListeners(): void {
        this.mainPage.element.addEventListener('click', this.onMainPageClick);
    }

    private onMainPageClick = (e: Event): void => {
        e.preventDefault();
        const target: EventTarget | null = e.target;
        if (target instanceof HTMLElement) {
            switch (target.dataset.link) {
                case ROUTE.LOGIN:
                    this.router.navigate(ROUTE.LOGIN);
                    document.title = 'storiesShelf store | Login';
                    break;
                case ROUTE.REGISTRATION:
                    this.router.navigate(ROUTE.REGISTRATION);
                    document.title = 'storiesShelf store | Registration';
                    break;
                case ROUTE.CATALOG:
                    this.router.navigate(ROUTE.CATALOG);
                    document.title = 'storiesShelf store | Catalog';
                    if (e.target) {
                        this.showCatalog();
                    }
                    break;
                case ROUTE.PRODUCT:
                    this.router.navigate(ROUTE.PRODUCT);
                    document.title = 'storiesShelf store | Product';
                    break;
                case ROUTE.USER:
                    this.router.navigate(ROUTE.USER);
                    document.title = 'storiesShelf store | User';
                    break;
                case ROUTE.BASKET:
                    this.router.navigate(ROUTE.BASKET);
                    document.title = 'storiesShelf store | Basket';
                    break;
                case ROUTE.ABOUT:
                    this.router.navigate(ROUTE.ABOUT);
                    document.title = 'shelfStories store | About';
                    break;
                default:
                    break;
            }
        }
    };

    public showCatalog(): void {
        this.apiProduct
            .getProducts()
            ?.then((resp: ClientResponse<ProductPagedQueryResponse>) => resp.body.results)
            .then((resp: Product[]) =>
                resp.map(async (product: Product) => {
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
            )
            .then((res) => {
                Promise.all(res).then((res) => this.app?.catalogPage.setContent(res));
                // console.log(res);
            })
            .catch((err) => console.log(err));
    }
}
