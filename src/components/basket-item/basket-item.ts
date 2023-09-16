import template from './basket-item.html';
import './basket-item.scss';
import { LineItem } from '@commercetools/platform-sdk';
import ElementCreator from '../../utils/template-creation';
import BasketPage from '../../pages/basket-page/basket-page';

export class BasketItem {
    private readonly _element: HTMLElement;
    public data: LineItem;
    private quantityIncreaseButton: HTMLButtonElement;
    private quantityDecreaseButton: HTMLButtonElement;
    private deleteButton: HTMLButtonElement;
    private basketPage: BasketPage;

    constructor(data: LineItem, basketPage: BasketPage) {
        this.data = data;
        this.basketPage = basketPage;
        if (!this.basketPage) {
            console.error('basketPage is null or undefined');
        }
        this._element = new ElementCreator({
            tag: 'div',
            classNames: ['basket-item', 'd-flex', 'column-gap-2', 'border', 'solid', 'border-black', 'border-1'],
            innerHTML: template,
        }).getElement();
        this.quantityIncreaseButton = this._element.querySelector('.quantity-increase') as HTMLButtonElement;
        this.quantityDecreaseButton = this._element.querySelector('.quantity-decrease') as HTMLButtonElement;
        this.deleteButton = this._element.querySelector('.delete-button') as HTMLButtonElement;

        this.setContent();
        this.setupEventListeners(this.quantityDecreaseButton);
        this.setupEventListeners(this.quantityIncreaseButton);
    }

    private setContent() {
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
        basketItemPrice.innerText = `Item price: ${price} €`;
        basketItemCount.innerText = `Count: ${this.data.quantity}`;
        basketItemTotalPrice.innerText = `Total price: ${this.data.quantity * price} €`;
    }

    public get element(): HTMLElement {
        return this._element;
    }

    private setupEventListeners(quantityChangeButton: HTMLButtonElement) {
        quantityChangeButton.addEventListener('click', (event) => {
            console.log('clicked');
            const lineItemId: string = this.data?.id;
            let newQuantity: number = this.data?.quantity;
            newQuantity = !event.target
                ? newQuantity
                : (event.target as HTMLButtonElement).className === 'quantity-decrease'
                ? --newQuantity
                : ++newQuantity;
            if (lineItemId) {
                console.log('Line item ID:', lineItemId);
                this.basketPage.changeQuantity(lineItemId, newQuantity);
            }
        });
    }
}
