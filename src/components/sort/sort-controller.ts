import { ApiProduct } from '../../api/api-products/api-products';
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
                if (selectedOption !== '') {
                    sortSelect.querySelector('option[value=""]')?.setAttribute('disabled', 'true');
                }
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
                        const priceA =
                            a.masterVariant.prices && a.masterVariant.prices[0]
                                ? a.masterVariant.prices[0].value.centAmount
                                : 0;
                        const priceB =
                            b.masterVariant.prices && b.masterVariant.prices[0]
                                ? b.masterVariant.prices[0].value.centAmount
                                : 0;
                        return priceA - priceB;
                    });
                    break;
                case 'price-desc':
                    products.sort((a, b) => {
                        const priceA =
                            a.masterVariant.prices && a.masterVariant.prices[0]
                                ? a.masterVariant.prices[0].value.centAmount
                                : 0;
                        const priceB =
                            b.masterVariant.prices && b.masterVariant.prices[0]
                                ? b.masterVariant.prices[0].value.centAmount
                                : 0;
                        return priceB - priceA;
                    });
                    break;
                /*case 'name-asc':
                    products.sort((a, b) => a.masterVariant.productName.localeCompare(b.masterVariant.productName));
                    break;
                case 'name-desc':
                    products.sort((a, b) => b.masterVariant.productName.localeCompare(a.masterVariant.productName));
                    break;*/
                default:
                    break;
            }

            this.catalogPage.setContent(products);
        }
    }
}
