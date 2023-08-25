import ElementCreator from '../../utils/template-creation';
import template from './catalog-page.html';
import './catalog-page.scss';
import ProductPage from '../product-page/product-page';

export default class CatalogPage {
    public element: HTMLElement;
    private catalogCard: Element | null;
    private product: ProductPage;

    constructor() {
        this.element = new ElementCreator({
            tag: 'section',
            classNames: ['catalog-page', 'flex-grow-1', 'd-flex', 'flex-row'],
            innerHTML: template,
        }).getElement();
        this.catalogCard = this.element.querySelector('.catalog-card');
        this.product = new ProductPage();
    }

    public getElement(): HTMLElement {
        return this.element;
    }

    // public setContent() {
    //     this.catalogCard?.append(this.product);
    // }
}
