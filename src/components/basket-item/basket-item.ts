import template from './basket-item.html';
import './basket-item.scss';
import { LineItem } from '@commercetools/platform-sdk';
import ElementCreator from '../../utils/template-creation';

export class BasketItem {
    private readonly _element: HTMLElement;
    public data: LineItem;
    private readonly quantityInput: HTMLInputElement;
    private readonly quantityDecreaseButton: HTMLButtonElement;
    private readonly quantityIncreaseButton: HTMLButtonElement;
    private readonly deleteButton: HTMLButtonElement;
    private basketItemCountElement: HTMLElement;
    private basketItemTotalPriceElement: HTMLElement;
    private updateCartAndRecalculateTotal: (newQuantity: number, total: number) => void;

    constructor(data: LineItem, updateCartAndRecalculateTotal: (newQuantity: number) => void) {
        this.data = data;
        this.updateCartAndRecalculateTotal = updateCartAndRecalculateTotal;
        this._element = new ElementCreator({
            tag: 'div',
            classNames: ['basket-item', 'd-flex', 'column-gap-2', 'border', 'solid', 'border-black', 'border-1'],
            innerHTML: template,
        }).getElement();
        this.quantityInput = this._element.querySelector('.basket-item-quantity') as HTMLInputElement;
        this.quantityDecreaseButton = this._element.querySelector('.quantity-decrease') as HTMLButtonElement;
        this.quantityIncreaseButton = this._element.querySelector('.quantity-increase') as HTMLButtonElement;
        this.deleteButton = this._element.querySelector('.delete-button') as HTMLButtonElement;

        this.quantityDecreaseButton.addEventListener('click', this.decreaseQuantity.bind(this));
        this.quantityIncreaseButton.addEventListener('click', this.increaseQuantity.bind(this));

        this.basketItemCountElement = this._element.querySelector('.basket-item-count') as HTMLElement;
        this.basketItemTotalPriceElement = this._element.querySelector('.basket-item-total-price') as HTMLElement;

        this.setContent();
    }

    private setContent() {
        const basketItemName: HTMLElement = this._element.querySelector('.basket-item-name') as HTMLElement;
        const basketItemImage: HTMLElement = this._element.querySelector('.basket-item-image') as HTMLElement;
        const basketItemPrice: HTMLElement = this._element.querySelector('.basket-item-price') as HTMLElement;
        basketItemName.innerText = this.data.name['en-US'];
        if (this.data.variant.images && this.data.variant.images[0]) {
            basketItemImage.style.backgroundImage = `url('${this.data.variant.images[0].url ?? ''}')`;
        }
        const price: number = this.data.price.discounted?.value
            ? this.data.price.discounted.value.centAmount / 100
            : this.data.price.value.centAmount / 100;
        basketItemPrice.innerText = `Item price: ${price} €`;
        this.quantityInput.value = this.data.quantity.toString();
        this.basketItemCountElement.innerText = `Count: ${this.quantityInput.value}`;
        this.basketItemTotalPriceElement.innerText = `Total price: ${this.data.quantity * price} €`;
    }

    public get element(): HTMLElement {
        return this._element;
    }

    private decreaseQuantity() {
        const currentQuantity = parseInt(this.quantityInput.value, 10);
        if (currentQuantity > 1) {
            this.quantityInput.value = (currentQuantity - 1).toString();
            this.handleQuantityChange();
        }
    }

    private increaseQuantity() {
        const currentQuantity = parseInt(this.quantityInput.value, 10);
        this.quantityInput.value = (currentQuantity + 1).toString();
        this.handleQuantityChange();
    }

    private handleQuantityChange() {
        const newQuantity = parseInt(this.quantityInput.value, 10);

        if (newQuantity > 0) {
            const price = this.data.price.discounted?.value
                ? this.data.price.discounted.value.centAmount / 100
                : this.data.price.value.centAmount / 100;
            const total = newQuantity * price;

            this.basketItemCountElement.innerText = `Count: ${newQuantity}`;
            this.basketItemTotalPriceElement.innerText = `Total price: ${total} €`;

            this.updateCartAndRecalculateTotal(newQuantity, total);
        } else {
            this.quantityInput.value = this.data.quantity.toString();
        }
    }
}
