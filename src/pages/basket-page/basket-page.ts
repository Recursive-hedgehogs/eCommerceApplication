import ElementCreator from '../../utils/template-creation';
import template from './basket-page.html';
import emptyBasketTemplate from './empty-basket-template.html';
import './basket-page.scss';
import { Cart, CartPagedQueryResponse, ClientResponse, LineItem } from '@commercetools/platform-sdk';
import { BasketItem } from '../../components/basket-item/basket-item';
import { ApiBasket } from '../../api/api-basket';

export default class BasketPage {
    private readonly _element: HTMLElement;
    private apiBasket: ApiBasket = new ApiBasket();
    private cart: Cart | null = null;
    // private clearBasketItems!: HTMLButtonElement;
    // private lineItemIds: string[] = [];

    constructor() {
        this._element = new ElementCreator({
            tag: 'section',
            classNames: ['basket-page-container'],
            innerHTML: template,
        }).getElement();
        const clearBasketButton = this._element.querySelector('.clear-basket') as HTMLButtonElement;
        clearBasketButton.addEventListener('click', () => {
            this.clearBasket();
        });
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

    public setEmptyBasket(): void {
        this.basketContainer.innerHTML = '';
        const emptyBasket = new ElementCreator({
            tag: 'div',
            classNames: ['empty-basket-container'],
            innerHTML: emptyBasketTemplate,
        }).getElement();
        this.basketContainer.append(emptyBasket);
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

    private isEmptyBasket(): Promise<boolean> {
        return Promise.resolve(this.getBasket()).then((cart) => {
            if (cart) {
                return !cart.lineItems.length;
            }
            return true;
        });
    }

    public get element(): HTMLElement {
        return this._element;
    }

    public get basketContainer(): HTMLElement {
        return this._element.querySelector('.basket-container') as HTMLElement;
    }

    public isProductInBasket(productId: string): Promise<boolean> {
        return Promise.resolve(this.getBasket()).then((cart) => {
            if (cart) {
                const foundItem = cart.lineItems.find((item) => item.productId === productId);
                return !!foundItem;
            }
            return false;
        });
    }

    public changeQuantity(lineItemId: string, newQuantity: number) {
        if (this.cart && this.apiBasket && typeof this.apiBasket.changeCartItemQuantity === 'function') {
            const cartId = this.cart?.id;
            const version = this.cart?.version;

            if (cartId) {
                this.apiBasket
                    ?.changeCartItemQuantity(cartId, lineItemId, version, newQuantity)
                    ?.then((response) => {
                        this.setContent(response.body);
                    })
                    .catch((error) => {
                        console.error('Error decreasing quantity:', error);
                    });
            } else {
                console.error('Cart ID is undefined');
            }
        } else {
            console.error('ApiBasket or changeCartItemQuantity is undefined');
        }
    }

    public deleteCartFromBasket(lineItemId: string) {
        if (this.cart && this.apiBasket && typeof this.apiBasket.removeCartItem === 'function') {
            const cartId = this.cart?.id;
            const version = this.cart?.version;

            if (cartId) {
                this.apiBasket
                    ?.removeCartItem(cartId, lineItemId, version)
                    ?.then((response) => {
                        this.setContent(response.body);
                    })
                    .catch((error) => {
                        console.error('Error product delete:', error);
                    });
            } else {
                console.error('Cart ID is undefined');
            }
        } else {
            console.error('ApiBasket or removeCartItem is undefined');
        }
    }

    public clearBasket() {
        if (confirm('Вы уверены, что хотите очистить корзину?')) {
            this.getBasket()?.then((cart) => {
                if (cart && this.apiBasket && typeof this.apiBasket.deleteCart === 'function') {
                    const cartId = cart.id;
                    const version = cart.version;
                    if (cartId) {
                        this.apiBasket.deleteCart(cartId, version)?.then(() => {
                            this.getBasket()?.then((cart) => {
                                if (cart) {
                                    this.setContent(cart);
                                }
                            });
                        });
                    }
                }
            });
        }
    }

    /*private addLineItemId(lineItemId: string) {
        this.lineItemIds.push(lineItemId);
    }

    private removeLineItemId(lineItemId: string) {
        const index = this.lineItemIds.indexOf(lineItemId);
        if (index !== -1) {
            this.lineItemIds.splice(index, 1);
        }
    }*/
}
