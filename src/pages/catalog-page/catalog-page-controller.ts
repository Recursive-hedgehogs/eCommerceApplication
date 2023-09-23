import App from '../../app/app';
import CatalogPage from './catalog-page';
import { Router } from '../../router/router';
import { ROUTE } from '../../constants/enums/enum';

export class CatalogPageController {
    public app: App;
    public catalogPage: CatalogPage;
    private router = new Router();

    constructor() {
        this.app = new App();
        this.catalogPage = this.app.catalogPage;
        this.addListeners();
    }

    private addListeners(): void {
        this.catalogPage.getElement().addEventListener('submit', this.onSearchSubmit);
        this.catalogPage.getElement().addEventListener('changePage', (e: Event) => this.onPageChange(e));
    }

    private onSearchSubmit = (e: Event): void => {
        e.preventDefault();
        const target: HTMLElement = e.target as HTMLElement;
        if (target.id === 'search-form') {
            const searchInput: HTMLInputElement = target.querySelector('.search-input') as HTMLInputElement;
            const search: string = searchInput.value;
            this.app.catalogPage.updateContent({ search });
        }
    };

    private onPageChange(e: Event): void {
        this.router.navigate(`${ROUTE.CATALOG}/${(e as CustomEvent).detail}`);
    }
}
