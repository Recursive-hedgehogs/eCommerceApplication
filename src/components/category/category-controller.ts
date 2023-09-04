import { CategoryComponent } from './category';
import { ClientResponse, ProductProjectionPagedSearchResponse } from '@commercetools/platform-sdk';
import { ApiProduct } from '../../api/api-products/api-products';
import App from '../../app/app';

export class CategoryController {
    private categoryComponent: CategoryComponent;
    private apiProduct: ApiProduct = new ApiProduct();
    private app: App;

    constructor(categoryComponent: CategoryComponent) {
        this.categoryComponent = categoryComponent;
        this.app = new App();
        this.addListeners();
    }

    private addListeners() {
        this.categoryComponent.categoryButton.addEventListener('click', this.onCategoryClick);
    }

    onCategoryClick = () => {
        const filter = `categories.id:"${this.categoryComponent.category.id}"`;
        this.apiProduct
            .getProductProjection([filter])
            ?.then((res: ClientResponse<ProductProjectionPagedSearchResponse>): void => {
                this.app.catalogPage.setContent(res.body.results);
            })
            .catch((err) => console.log(err));
    };
}
