import App from '../../app/app';
import CatalogPage from './catalog-page';
import { ClientResponse, ProductProjectionPagedSearchResponse } from '@commercetools/platform-sdk';
import { ApiProduct } from '../../api/api-products/api-products';

export class CatalogPageController {
    private app: App;
    private catalogPage: CatalogPage;
    private apiProduct: ApiProduct;

    constructor() {
        this.app = new App();
        this.catalogPage = this.app.catalogPage;
        this.apiProduct = new ApiProduct();
        this.addListeners();
    }

    private addListeners(): void {
        this.catalogPage.getElement().addEventListener('submit', this.onSearchSubmit);
    }

    private onSearchSubmit = (e: Event): void => {
        e.preventDefault();
        const target: HTMLElement = e.target as HTMLElement;
        if (target.id === 'search-form') {
            const searchInput: HTMLInputElement = target.querySelector('.search-input') as HTMLInputElement;
            const value: string = searchInput.value;
            this.apiProduct
                .getProductProjection(undefined, undefined, value)
                ?.then((res: ClientResponse<ProductProjectionPagedSearchResponse>): void => {
                    this.app.catalogPage.setContent(res.body.results);
                });
        }
    };
}
