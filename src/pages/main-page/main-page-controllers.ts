import MainPage from './main-page';
import { ROUTE } from '../../constants/enums/enum';
import { ClientResponse, Product, ProductDiscount, ProductPagedQueryResponse } from '@commercetools/platform-sdk';
import App from '../../app/app';
import { ApiProduct } from '../../api/products/api-products';
import { Router } from '../../router/router';

export class MainPageControllers {
    private mainPage: MainPage;
    private app: App;
    private apiProduct: ApiProduct;
    private router: Router;

    constructor() {
        this.app = new App();
        this.router = new Router();
        this.mainPage = this.app.mainPage;
        this.apiProduct = new ApiProduct();
        this.addListeners();
    }

    addListeners(): void {
        this.app?.view?.pages?.get(ROUTE.MAIN)?.addEventListener('click', this.onMainPageClick);
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

    private showCatalog() {
        this.apiProduct
            .getProducts()
            ?.then((resp: ClientResponse<ProductPagedQueryResponse>) => resp.body.results)
            .then((resp: Product[]) =>
                resp.map(async (product: Product) => {
                    try {
                        const discountResponse: ClientResponse<ProductDiscount> | undefined =
                            await this.apiProduct.getProductDiscountById(product.id);
                        const discount: ProductDiscount | undefined = discountResponse?.body;
                        return { product, discount };
                    } catch {
                        return { product };
                    }
                })
            )
            .then((res) => {
                Promise.all(res).then((res) => this.app?.catalogPage.setContent(res));
                console.log(res);
                // this.app?.catalogPage.setContent(res);
            })
            .catch((err) => console.log(err));
    }
}
