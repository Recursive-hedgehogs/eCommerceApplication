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
                const emptyOption = sortSelect.querySelector('option[value=""]');
                if (emptyOption) {
                    emptyOption.setAttribute('disabled', 'true');
                }
                this.sortProducts(selectedOption);
            });
        }
    }

    public sortProducts(option: string): void {
        const originalProducts = this.catalogPage.originalProducts.slice();

        if (originalProducts) {
            this.apiProduct
                .getProductProjection(undefined, [
                    'variants.price.centAmount asc',
                    'variants.price.centAmount desc',
                    'name.en-US desc',
                ])
                ?.then((res) => {
                    const sortedProducts = res.body.results.slice();

                    switch (option) {
                        case 'price-asc':
                            sortedProducts.sort((a, b) => {
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
                            sortedProducts.sort((a, b) => {
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
                        case 'name-asc':
                            sortedProducts.sort((a, b) => a.name['en-US'].localeCompare(b.name['en-US']));
                            break;
                        default:
                            break;
                    }

                    this.catalogPage.setContent(sortedProducts);
                })
                .catch((err) => console.log(err));
        }
    }
}
