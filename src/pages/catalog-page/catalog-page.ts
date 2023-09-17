import ElementCreator from '../../utils/template-creation';
import template from './catalog-page.html';
import './catalog-page.scss';
import { ProductCard } from '../../components/product-card/product-card';
import { ProductCardController } from '../../components/product-card/product-card-controller';
import { Filters } from '../../components/filters/filters';
import { FiltersController } from '../../components/filters/filters-controller';
import { Sort } from '../../components/sort/sort';
import { SortController } from '../../components/sort/sort-controller';
import {
    Category,
    CategoryPagedQueryResponse,
    ClientResponse,
    ProductProjection,
    ProductProjectionPagedSearchResponse,
} from '@commercetools/platform-sdk';
import { ApiProduct } from '../../api/api-products/api-products';
import { CategoryComponent } from '../../components/category/category';
import { CategoryController } from '../../components/category/category-controller';
import { IProductFiltersCredentials } from '../../constants/interfaces/credentials.interface';
import { Pagination } from '../../components/pagination/pagination';
import { PaginationController } from '../../components/pagination/pagination-controller';

export default class CatalogPage {
    public element!: HTMLElement;
    private readonly catalogContainer!: Element | null;
    private readonly sort?: Sort;
    private products?: ProductCard[];
    private readonly filters?: Filters;
    private apiProduct: ApiProduct = new ApiProduct();
    private readonly pagination?: Pagination;
    private static singleton: CatalogPage;
    private paginationController?: PaginationController;

    constructor() {
        if (CatalogPage.singleton) {
            return CatalogPage.singleton;
        }

        this.element = new ElementCreator({
            tag: 'section',
            classNames: ['catalog-page', 'flex-grow-1', 'd-flex', 'flex-row'],
            innerHTML: template,
        }).getElement();
        this.catalogContainer = this.element.querySelector('.catalog-container');
        this.filters = new Filters();
        new FiltersController(this.filters, this);
        this.sort = new Sort();
        new SortController(this.sort, this);
        this.pagination = new Pagination();
        this.paginationController = new PaginationController(this.pagination);
        this.start();
        CatalogPage.singleton = this;
    }

    public getElement(): HTMLElement {
        return this.element;
    }

    public start(): void {
        const catalogFilters: Element | null = this.element.querySelector('.catalog-filters');
        if (catalogFilters && this.filters?.element) {
            catalogFilters.append(this.filters.element);
        }

        const catalogSorting: Element | null = this.element.querySelector('.catalog-sorting');
        if (catalogSorting && this.sort?.element) {
            catalogSorting.append(this.sort.element);
        }
    }

    public setContent(products: ProductProjection[], limit: number, totalCount?: number): void {
        this.products = products.map((product: ProductProjection) => {
            const productCard: ProductCard = new ProductCard(product);
            new ProductCardController(productCard);
            return productCard;
        });
        const productElements: HTMLElement[] = this.products.map((el: ProductCard) => el.element) as HTMLElement[];
        if (this.catalogContainer) {
            this.catalogContainer.innerHTML = '';
            this.catalogContainer.append(...productElements);
        }
        this.catalogContainer?.after(this.pagination?.element as Node);
        const pagesCount: number = totalCount ? Math.ceil(totalCount / limit) : 1;
        const pageNumber: number = +window.location.pathname.slice(9);
        this.pagination?.setContent(pagesCount, pageNumber);
        this.paginationController?.updateListeners();
    }

    public showCatalog(page?: string): void {
        const pageNumber: number | undefined = page ? +page : undefined;
        this.getCategories();
        this.updateContent({}, pageNumber);
    }

    private getCategories(): Promise<void> | undefined {
        return this.apiProduct
            .getCategories()
            ?.then((resp: ClientResponse<CategoryPagedQueryResponse>) => resp.body.results)
            .then((categories: Category[]) => this.createCategories(categories));
    }

    private createCategories(categories: Category[]): void {
        const categoriesContainer: HTMLElement = this.element.querySelector('.categories-container') as HTMLElement;
        const categoriesArray: HTMLElement[] = categories
            .filter((category: Category) => !category.parent)
            .map((category: Category) => {
                const categoryComponent: CategoryComponent = new CategoryComponent(category, categories);
                new CategoryController(categoryComponent);
                return categoryComponent.element;
            });
        categoriesContainer.innerHTML = '';
        categoriesContainer.append(...categoriesArray);
    }

    public updateContent(filter: IProductFiltersCredentials, page?: number): void {
        const offset: number | undefined = page ? (page - 1) * 20 : undefined;
        this.apiProduct
            .getProductProjection(filter, offset)
            ?.then((res: ClientResponse<ProductProjectionPagedSearchResponse>): void => {
                this.setContent(res.body.results, res.body.limit, res.body.total);
            })
            .catch((err) => console.log(err));
    }

    public updateCardsButtonAddToCart(idArray: string[]): void {
        setTimeout(
            () =>
                this.products
                    ?.filter((product: ProductCard) => {
                        return idArray.includes(product.productId);
                    })
                    .forEach((product: ProductCard): void => {
                        product.inCart = true;
                    }),
            1000
        );
    }
}
