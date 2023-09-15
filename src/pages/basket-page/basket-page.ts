import ElementCreator from '../../utils/template-creation';
import template from './basket-page.html';
import './basket-page.scss';
import { Cart, CartPagedQueryResponse, ClientResponse, LineItem } from '@commercetools/platform-sdk';
import { BasketItem } from '../../components/basket-item/basket-item';
import { ApiBasket } from '../../api/api-basket';

export default class BasketPage {
    private readonly _element: HTMLElement;
    private apiBasket: ApiBasket = new ApiBasket();
    private cart: Cart | null = null;

    constructor() {
        this._element = new ElementCreator({
            tag: 'section',
            classNames: ['basket-page-container'],
            innerHTML: template,
        }).getElement();
        //this.setupEventListeners();
    }

    public setContent(data: Cart): void {
        this.basketContainer.innerHTML = '';
        const basketItemsArray: HTMLElement[] = data.lineItems.map(
            (item: LineItem) => new BasketItem(item, this).element
        );
        this.basketContainer.append(...basketItemsArray);
        const totalCartPrice = this._element.querySelector('.basket-total-price') as HTMLElement;
        totalCartPrice.innerText = `Total price: ${data.totalPrice.centAmount / 100} €`;
        this.cart = data;
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

    /*public decreaseQuantity(lineItemId: string) {
        if (this.cart && this.apiBasket && typeof this.apiBasket.decreaseCartItemQuantity === 'function') {
            const cartId = this.cart?.id;
            const version = this.cart?.version;

            if (cartId) {
                this.apiBasket
                    .decreaseCartItemQuantity(cartId, lineItemId, version)
                    .then((response) => {
                        this.setContent(response.body);
                    })
                    .catch((error) => {
                        console.error('Error decreasing quantity:', error);
                    });
            } else {
                console.error('Cart ID is undefined');
            }
        } else {
            console.error('ApiBasket or decreaseCartItemQuantity is undefined');
        }
    }*/

    /*private setupEventListeners() {
        const decreaseButtons = document.querySelectorAll('.decrease-quantity-button');

        decreaseButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                const targetElement = event.target as HTMLElement;
                const basketItemElement = targetElement.closest('.basket-item');

                if (basketItemElement) {
                    const lineItemId = basketItemElement.getAttribute('data-line-item-id');

                    if (lineItemId) {
                        this.decreaseQuantity(lineItemId);
                    }
                }
            });
        });
    }*/
}
