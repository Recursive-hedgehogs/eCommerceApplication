import App from '../../app/app';
import CatalogPage from './catalog-page';

export class CatalogPageController {
    private app: App;
    private catalogPage: CatalogPage;

    constructor() {
        this.app = new App();
        this.catalogPage = this.app.catalogPage;
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
            const search: string = searchInput.value;
            this.app.catalogPage.updateContent({ search });
        }
    };
}
