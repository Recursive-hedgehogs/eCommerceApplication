import ElementCreator from '../../utils/template-creation';
import template from './basket-page.html';
import './basket-page.scss';
import { Cart, CartPagedQueryResponse, ClientResponse, LineItem } from '@commercetools/platform-sdk';
import { BasketItem } from '../../components/basket-item/basket-item';
import { ApiBasket } from '../../api/api-basket';

export default class BasketPage {
    private readonly _element: HTMLElement;
    private apiBasket: ApiBasket = new ApiBasket();

    constructor() {
        this._element = new ElementCreator({
            tag: 'section',
            classNames: ['basket-page-container'],
            innerHTML: template,
        }).getElement();
    }

    public setContent(data: Cart): void {
        this.basketContainer.innerHTML = '';
        const basketItemsArray: HTMLElement[] = data.lineItems.map((item: LineItem) => {
            const basketItem = new BasketItem(item, () => this.updateCartAndRecalculateTotal(data));
            return basketItem.element;
        });
        this.basketContainer.append(...basketItemsArray);
        const totalCartPrice = this._element.querySelector('.basket-total-price') as HTMLElement;
        totalCartPrice.innerText = `Total price: ${data.totalPrice.centAmount / 100} €`;
    }

    public getBasket() {
        return this.apiBasket
            .getCarts()
            ?.then((resp: ClientResponse<CartPagedQueryResponse>) => resp.body)
            .then((resp: CartPagedQueryResponse) => resp.results)
            .then((resp: Cart[]) => resp[0])
            .then((cart: Cart) => {
                if (cart?.id) {
                    return cart;
                } else {
                    return this.apiBasket.createCart();
                }
            });
    }

    public get element(): HTMLElement {
        return this._element;
    }

    public get basketContainer(): HTMLElement {
        return this._element.querySelector('.basket-container') as HTMLElement;
    }

    private async updateCartAndRecalculateTotal(data: Cart) {
        try {
            if (data) {
                const totalPrice = data.totalPrice.centAmount / 100;
                const totalCartPrice = this._element.querySelector('.basket-total-price') as HTMLElement;
                totalCartPrice.innerText = `Total price: ${totalPrice} €`;
            } else {
                console.error('Error updating cart');
            }
        } catch (error) {
            console.error('An error occurred while making an API request', error);
        }
    }
}
