/*import { ApiProduct } from '../../api/api-products/api-products';
import CatalogPage from '../../pages/catalog-page/catalog-page';
import { ProductCard } from '../product-card/product-card';
import { Sort } from './sort';
import { ProductProjection } from '@commercetools/platform-sdk';

export class SortController {
    private sort: Sort;
    private apiProduct = new ApiProduct();
    private catalogPage: CatalogPage;

    constructor(sort: Sort, catalogPage: CatalogPage) {
        this.sort = sort;
        this.catalogPage = catalogPage;
        this.addListeners();
    }

    private addListeners(): void {
        const sortSelect = this.sort.element?.querySelector('#sort-select') as HTMLSelectElement;

        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                const selectedOption = sortSelect.value;
                this.sortProducts(selectedOption);
            });
        }
    }

    public sortProducts(option: string): void {
        const products = this.catalogPage.originalProducts.slice();

        if (products) {
            switch (option) {
                case 'price-asc':
                    products.sort((a, b) => {
                        const priceA = a.prices && a.prices[0] ? a.prices[0].value.centAmount : 0;
                        const priceB = b.prices && b.prices[0] ? b.prices[0].value.centAmount : 0;
                        return priceA - priceB;
                    });
                    break;
                case 'price-desc':
                    products.sort((a, b) => {
                        const priceA = a.prices && a.prices[0] ? a.prices[0].value.centAmount : 0;
                        const priceB = b.prices && b.prices[0] ? b.prices[0].value.centAmount : 0;
                        return priceB - priceA;
                    });
                    break;
                case 'name-asc':
                    products.sort((a, b) => a.productName.localeCompare(b.productName));
                    break;
                case 'name-desc':
                    products.sort((a, b) => b.productName.localeCompare(a.productName));
                    break;
                default:
                    break;
            }

            this.catalogPage.setContent(products);
        }
    }
}*/
