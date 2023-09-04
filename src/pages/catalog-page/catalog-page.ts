import ElementCreator from '../../utils/template-creation';
import template from './catalog-page.html';
import './catalog-page.scss';
import { ProductCard } from '../../components/product-card/product-card';
import { ProductCardController } from '../../components/product-card/product-card-controller';
import { Filters } from '../../components/filters/filters';
import { FiltersController } from '../../components/filters/filters-controller';
import {
    Category,
    CategoryPagedQueryResponse,
    ClientResponse,
    ProductProjection,
    ProductProjectionPagedSearchResponse,
} from '@commercetools/platform-sdk';
import { ApiProduct } from '../../api/api-products/api-products';

export default class CatalogPage {
    public element!: HTMLElement;
    private readonly catalogContainer!: Element | null;
    private products?: ProductCard[];
    private readonly filters?: Filters;
    private apiProduct: ApiProduct = new ApiProduct();
    private static singleton: CatalogPage;

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
    }

    public setContent(products: ProductProjection[]): void {
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
        this.getCategories()?.then((resp) => this.createCategories(resp));
    }

    public showCatalog(): void {
        this.apiProduct
            .getProductProjection()
            ?.then((resp: ClientResponse<ProductProjectionPagedSearchResponse>) => resp.body.results)
            .then((res: ProductProjection[]) => this.setContent(res));
    }

    private getCategories() {
        return this.apiProduct.getCategories()?.then((resp: ClientResponse<CategoryPagedQueryResponse>) => {
            return resp.body.results;
            // const categories = allCategories.filter((category) => !category.parent);
            // const subCategories = allCategories.filter((categories) => categories.parent);
            // const map: Map<string, Category[]> = new Map();
            // const obj = {};
            // subCategories.forEach((el: Category) => {
            //     if(!map.has(el.parent!.id)) {
            //         map.set(el.parent!.id, [el]);
            //     } else {
            //         map.get(el.parent!.id)?.push(el);
            //     }
            // });
            // console.log(map)
            //
        });
    }

    private createCategories(categories: Category[]) {
        const categoriesContainer = this.element.querySelector('.categories-container') as HTMLElement;
        const categoriesArray = categories.map((category: Category) => this.createCategory(categories, category));
        categoriesContainer.append(...categoriesArray);
    }

    private createCategory(categories: Category[], category: Category) {
        // const categoryBustton: ElementCreator<HTMLElement> =  new ElementCreator({
        //     tag: 'button',
        //     classNames: ['btn', 'btn-secondary'],
        //     innerHTML: category.name['en-US'],
        // })
        const categoryOuter: HTMLElement = new ElementCreator({
            tag: 'div',
            classNames: ['btn-group', 'dropend'],
            innerHTML: `<button class="btn btn-secondary">${category.name['en-US']}</button>`,
        }).getElement();
        const childs = categories.filter((el) => el.parent?.id === category.id);
        if (childs.length) {
            const categoryArrow = new ElementCreator({
                tag: 'button',
                classNames: ['btn', 'btn-secondary', 'dropdown-toggle', 'dropdown-toggle-split'],
            }).getElement();
            categoryArrow.setAttribute('data-bs-toggle', 'dropdown');
            const categoryInner = new ElementCreator({
                tag: 'ul',
                classNames: ['dropdown-menu'],
            }).getElement();
            childs.forEach((category) => {
                const childCategory = this.createCategory(categories, category);
                categoryInner.append(childCategory);
            });
            categoryOuter.append(categoryArrow, categoryInner);
        }
        return categoryOuter;
    }
}
