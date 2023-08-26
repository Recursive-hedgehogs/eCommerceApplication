import ElementCreator from '../../utils/template-creation';
import template from './catalog-page.html';
import './catalog-page.scss';
import { ProductCard } from '../../components/product/product';
import { Product } from '@commercetools/platform-sdk';

export default class CatalogPage {
    public element!: HTMLElement;
    private catalogContainer!: Element | null;
    private products?: ProductCard[];
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
        CatalogPage.singleton = this;
    }

    public getElement(): HTMLElement {
        return this.element;
    }

    public setContent(data: Product[]): void {
        this.products = data.map((product: Product) => new ProductCard(product));
        const productElements: HTMLElement[] = this.products.map((el: ProductCard) => el.element) as HTMLElement[];
        console.log(productElements, this.catalogContainer);
        this.catalogContainer?.append(...productElements);
    }
}
