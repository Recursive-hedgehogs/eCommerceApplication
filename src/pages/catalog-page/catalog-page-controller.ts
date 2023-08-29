import CatalogPage from './catalog-page';
import App from '../../app/app';

export class CatalogPageController {
    private app: App;
    private catalogPage: CatalogPage;

    constructor() {
        this.app = new App();
        this.catalogPage = this.app.catalogPage;
    }
}
