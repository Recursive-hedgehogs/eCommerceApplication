import ElementCreator from '../../utils/template-creation';
import template from './basket-page.html';
import './basket-page.scss';

export default class BasketPage {
    public element: HTMLElement;

    constructor() {
        this.element = new ElementCreator({
            tag: 'section',
            classNames: ['basket-page-container'],
            innerHTML: template,
        }).getElement();
    }

    public getElement(): HTMLElement {
        return this.element;
    }
}
