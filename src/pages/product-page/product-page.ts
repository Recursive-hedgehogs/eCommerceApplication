import ElementCreator from '../../utils/template-creation';
import template from './product-page.html';

export default class ProductPage {
    public element: HTMLElement;

    constructor() {
        this.element = new ElementCreator({
            tag: 'section',
            classNames: ['product-page'],
            innerHTML: template,
        }).getElement();
    }

    public getElement(): HTMLElement {
        return this.element;
    }
}
