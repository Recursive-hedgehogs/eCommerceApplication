import template from './basket-item.html';
import './basket-item.scss';
import { LineItem } from '@commercetools/platform-sdk';
import ElementCreator from '../../utils/template-creation';
import BasketPage from '../../pages/basket-page/basket-page';

export class BasketItem {
    private readonly _element: HTMLElement;
    private readonly basketPage: BasketPage;
    public data: LineItem;
    public quantityIncreaseButton: HTMLButtonElement;
    public quantityDecreaseButton: HTMLButtonElement;
    public deleteButton: HTMLButtonElement;

    constructor(data: LineItem, basketPage: BasketPage) {
        this.data = data;
        this.basketPage = basketPage;
        if (!this.basketPage) {
            console.error('basketPage is null or undefined');
        }
        this._element = new ElementCreator({
            tag: 'div',
            classNames: [
                'basket-item',
                'd-flex',
                'flex-column',
                'flex-sm-row',
                'column-gap-2',
                'border',
                'solid',
                'border-dark',
                'rounded-2',
                'border-1',
                'p-3',
            ],
            innerHTML: template,
        }).getElement();
        this.quantityIncreaseButton = this._element.querySelector('.quantity-increase') as HTMLButtonElement;
        this.quantityDecreaseButton = this._element.querySelector('.quantity-decrease') as HTMLButtonElement;
        this.deleteButton = this._element.querySelector('.delete-button') as HTMLButtonElement;
        this.setContent();
    }

    private setContent(): void {
        const basketItemName: HTMLElement = this._element.querySelector('.basket-item-name') as HTMLElement;
        const basketItemImage: HTMLElement = this._element.querySelector('.basket-item-image') as HTMLElement;
        const basketItemPrice: HTMLElement = this._element.querySelector('.basket-item-price') as HTMLElement;
        const basketItemCount: HTMLElement = this._element.querySelector('.basket-item-count') as HTMLElement;
        const basketItemTotalPrice: HTMLElement = this._element.querySelector(
            '.basket-item-total-price'
        ) as HTMLElement;
        basketItemName.innerText = this.data.name['en-US'];
        if (this.data.variant.images && this.data.variant.images[0]) {
            basketItemImage.style.backgroundImage = `url('${this.data.variant.images[0].url ?? ''}')`;
        }
        const price: number = this.data.price.discounted?.value
            ? this.data.price.discounted.value.centAmount / 100
            : this.data.price.value.centAmount / 100;
        basketItemPrice.innerText = `Price: ${price} €`;
        basketItemCount.innerText = `${this.data.quantity}`;
        basketItemTotalPrice.innerText = `Summa: ${Math.round(this.data.quantity * price * 10) / 10} €`;
    }

    public get element(): HTMLElement {
        return this._element;
    }
}
