import ElementCreator from '../../utils/template-creation';
import template from './basket-page.html';
import './basket-page.scss';
import { LineItem } from '@commercetools/platform-sdk';
import { BasketItem } from '../../components/basket-item/basket-item';

export default class BasketPage {
    private readonly _element: HTMLElement;

    constructor() {
        this._element = new ElementCreator({
            tag: 'section',
            classNames: ['basket-page-container'],
            innerHTML: template,
        }).getElement();
    }

    public setContent(data: LineItem[]): void {
        this.basketContainer.innerHTML = '';
        const basketItemsArray: HTMLElement[] = data.map((item: LineItem) => new BasketItem(item).element);
        this.basketContainer.append(...basketItemsArray);
    }

    public get element(): HTMLElement {
        return this._element;
    }

    public get basketContainer(): HTMLElement {
        return this._element.querySelector('.basket-container') as HTMLElement;
    }
}
