import ElementCreator from '../../utils/template-creation';
import template from './catalog-page.html';

export default class CatalogPage {
    public element: HTMLElement;

    constructor() {
        this.element = new ElementCreator({
            tag: 'section',
            classNames: ['catalog-page'],
            innerHTML: template,
        }).getElement();
    }

    public getElement(): HTMLElement {
        return this.element;
    }
}
