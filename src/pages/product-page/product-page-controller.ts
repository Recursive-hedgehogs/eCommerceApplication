import App from '../../app/app';
import ProductPage from './product-page';

export class ProductPageController {
    private app: App;
    private productPage: ProductPage;

    constructor() {
        this.app = new App();
        this.productPage = this.app.productPage;
    }
}
