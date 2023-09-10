import template from './basket-item.html';
import './basket-item.scss';
import { LineItem } from '@commercetools/platform-sdk';
import ElementCreator from '../../utils/template-creation';

export class BasketItem {
    private readonly _element: HTMLElement;
    public data: LineItem;

    constructor(data: LineItem) {
        this.data = data;
        this._element = new ElementCreator({
            tag: 'div',
            classNames: ['basket-item', 'd-flex'],
            innerHTML: template,
        }).getElement();
        this.setContent();
    }

    private setContent() {
        const basketItemName = this._element.querySelector('.basket-item-name') as HTMLElement;
        const basketItemImage = this._element.querySelector('.basket-item-image') as HTMLElement;
        const basketItemPrice = this._element.querySelector('.basket-item-price') as HTMLElement;
        const basketItemCount = this._element.querySelector('.basket-item-count') as HTMLElement;
        const basketItemTotalPrice = this._element.querySelector('.basket-item-total-price') as HTMLElement;
        basketItemName.innerText = this.data.name['en-US'];
        if (this.data.variant.images && this.data.variant.images[0]) {
            basketItemImage.style.backgroundImage = `url('${this.data.variant.images[0].url ?? ''}')`;
        }
        const price = this.data.price.discounted?.value
            ? this.data.price.discounted.value.centAmount / 100
            : this.data.price.value.centAmount / 100;
        basketItemPrice.innerText = String(price);
        basketItemCount.innerText = `${this.data.quantity}`;
        basketItemTotalPrice.innerText = `${this.data.quantity * price}`;
    }

    public get element(): HTMLElement {
        return this._element;
    }
}
