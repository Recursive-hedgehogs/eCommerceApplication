import ElementCreator from '../../utils/template-creation';
import template from './basket-page.html';
import emptyBasketTemplate from './empty-basket-template.html';
import './basket-page.scss';
import { Cart, ClientResponse, LineItem } from '@commercetools/platform-sdk';
import { BasketItem } from '../../components/basket-item/basket-item';
import { ApiBasket } from '../../api/api-basket/api-basket';
import { BasketItemController } from '../../components/basket-item/basket-item-controller';
import { State } from '../../state/state';
import Header from '../../components/header/header';

export default class BasketPage {
    private readonly _element: HTMLElement;
    private apiBasket: ApiBasket = new ApiBasket();
    private state: State;
    public cart: Cart | null = null;
    private header: Header;

    constructor(header: Header) {
        this._element = new ElementCreator({
            tag: 'section',
            classNames: ['basket-page-container'],
            innerHTML: template,
        }).getElement();
        this.state = new State();
        this.header = header;
    }

    public get element(): HTMLElement {
        return this._element;
    }

    public get basketContainer(): HTMLElement {
        return this._element.querySelector('.basket-container') as HTMLElement;
    }

    public setContent(data: Cart): void {
        this.basketContainer.innerHTML = '';
        const basketItemsArray: HTMLElement[] = data.lineItems.map((item: LineItem) => {
            const basketItem: BasketItem = new BasketItem(item, this);
            new BasketItemController(basketItem);
            return basketItem.element;
        });
        this.basketContainer.append(...basketItemsArray);
        const totalCartPrice: HTMLElement = this._element.querySelector('.basket-total-price') as HTMLElement;
        totalCartPrice.innerText = `Total price: ${data.totalPrice.centAmount / 100} €`;
        const summa = this._element.querySelector('.basket-summa') as HTMLElement;
        const clearBasket = this._element.querySelector('.clear-basket') as HTMLElement;
        summa.classList.remove('d-none');
        clearBasket.classList.remove('d-none');
        this.cart = data;
    }

    public setEmptyBasket(): void {
        this.basketContainer.innerHTML = '';
        const emptyBasket: HTMLElement = new ElementCreator({
            tag: 'div',
            classNames: ['empty-basket-container'],
            innerHTML: emptyBasketTemplate,
        }).getElement();
        const summa = this._element.querySelector('.basket-summa') as HTMLElement;
        const clearBasket = this._element.querySelector('.clear-basket') as HTMLElement;
        summa.classList.add('d-none');
        clearBasket.classList.add('d-none');
        this.basketContainer.append(emptyBasket);
        this.header.setItemsNumInBasket(0);
        localStorage.removeItem('cartID');
        this.state.basketId = '';
    }

    public getBasket(): Promise<Cart | undefined> | undefined {
        console.log('4', this.state.basketId);
        if (this.state.basketId) {
            console.log('5', this.state.basketId);
            return this.apiBasket
                .getCartById(this.state.basketId)
                ?.then(({ body }) => body)
                .catch(
                    () =>
                        this.apiBasket.createCart()?.then((cart: Cart) => {
                            localStorage.setItem('cartID', cart.id);
                            this.state.basketId = cart.id;
                            return cart;
                        })
                );
        }
        console.log('@@@API_BASKET_CREATE_CART', this.apiBasket.createCart);
        return this.apiBasket.createCart()?.then((cart: Cart) => {
            localStorage.setItem('cartID', cart.id);
            this.state.basketId = cart.id;
            return cart;
        });
    }

    public isProductInBasket(productId: string): Promise<boolean> {
        return Promise.resolve(this.getBasket()).then((cart: Cart | void | undefined): boolean => {
            if (cart) {
                const foundItem: LineItem | undefined = cart.lineItems.find(
                    (item: LineItem): boolean => item.productId === productId
                );
                return !!foundItem;
            }
            return false;
        });
    }

    public changeQuantity(lineItemId: string, newQuantity: number): void {
        if (this.cart && this.apiBasket && typeof this.apiBasket.changeCartItemQuantity === 'function') {
            const cartId: string = this.cart?.id;
            const version: number = this.cart?.version;

            if (cartId) {
                this.apiBasket
                    ?.changeCartItemQuantity(cartId, lineItemId, version, newQuantity)
                    ?.then((response: ClientResponse<Cart>): void => {
                        this.setContent(response.body);
                        this.header.setItemsNumInBasket(response.body.totalLineItemQuantity ?? 0);
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

    public deleteCartFromBasket(lineItemId: string): void {
        if (this.cart && this.apiBasket && typeof this.apiBasket.removeCartItem === 'function') {
            const cartId: string = this.cart?.id;
            const version: number = this.cart?.version;

            if (cartId) {
                this.apiBasket
                    ?.removeCartItem(cartId, lineItemId, version)
                    ?.then((response: ClientResponse<Cart>): void => {
                        this.setContent(response.body);
                        this.header.setItemsNumInBasket(response.body.totalLineItemQuantity ?? 0);
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

    public clearBasket(): void {
        if (confirm('Are you sure you want to empty the basket?')) {
            this.getBasket()?.then((cart: Cart | void | undefined): void => {
                if (cart && this.apiBasket && typeof this.apiBasket.deleteCart === 'function') {
                    const cartId: string = cart.id;
                    const version: number = cart.version;
                    if (cartId) {
                        this.apiBasket.deleteCart(cartId, version)?.then((): void => {
                            this.setEmptyBasket();
                        });
                    }
                }
            });
        }
    }

    public onSubmitPromo = (e: SubmitEvent) => {
        const promoInput = this.element.querySelector('#promo') as HTMLInputElement;
        e.preventDefault();
        if (this.cart) {
            this.apiBasket
                .addDiscountCodeToCart(this.cart.id, this.cart.version, promoInput.value)
                ?.then((resp) => {
                    const totalCartPrice: HTMLElement = this._element.querySelector(
                        '.basket-total-price'
                    ) as HTMLElement;
                    totalCartPrice.innerText = `Total price: ${resp.body.totalPrice.centAmount / 100} €`;
                    this.cart = resp.body;
                    // this.setContent(resp.body)
                    // console.log(resp);
                })
                .catch(() => {
                    if (this.cart?.discountCodes && this.cart?.discountCodes[0]) {
                        this.apiBasket
                            .removeDiscountCodeFromCart(
                                this.cart.id,
                                this.cart.version,
                                this.cart.discountCodes[0].discountCode.id
                            )
                            ?.then((resp) => {
                                const totalCartPrice: HTMLElement = this._element.querySelector(
                                    '.basket-total-price'
                                ) as HTMLElement;
                                totalCartPrice.innerText = `Total price: ${resp.body.totalPrice.centAmount / 100} €`;
                                this.cart = resp.body;
                            });
                    }
                    alert('Wrong code');
                });
        }
        console.log('ggggg');
    };
}
