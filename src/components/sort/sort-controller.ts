import CatalogPage from '../../pages/catalog-page/catalog-page';
import { Sort } from './sort';
import { SORT } from '../../constants/enums/enum';

export class SortController {
    private sort: Sort;
    private catalogPage: CatalogPage;

    constructor(sort: Sort, catalogPage: CatalogPage) {
        this.sort = sort;
        this.catalogPage = catalogPage;
        this.addListeners();
    }

    private addListeners(): void {
        const sortSelect: HTMLSelectElement = this.sort.element?.querySelector('#sort-select') as HTMLSelectElement;
        if (sortSelect) {
            sortSelect.addEventListener('change', (): void => {
                const selectedOption: string = sortSelect.value;
                const emptyOption: Element | null = sortSelect.querySelector('option[value=""]');
                if (emptyOption) {
                    emptyOption.setAttribute('disabled', 'true');
                }
                this.sortProducts(selectedOption);
            });
        }
    }

    public sortProducts(option: string): void {
        if (Object.keys(SORT).includes(option)) {
            const sort: string[] = [SORT[option] as string];
            this.catalogPage.updateContent({ sort });
        }
    }
}
