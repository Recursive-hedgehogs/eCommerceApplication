import ElementCreator from '../../utils/template-creation';
import template from './basket-page.html';
import './basket-page.scss';
import { Cart, CartPagedQueryResponse, ClientResponse, LineItem } from '@commercetools/platform-sdk';
import { BasketItem } from '../../components/basket-item/basket-item';
import { ApiBasket } from '../../api/api-basket';
import { State } from '../../state/state';

export default class BasketPage {
    private readonly _element: HTMLElement;
    private apiBasket: ApiBasket = new ApiBasket();
    private state: State;

    constructor() {
        this._element = new ElementCreator({
            tag: 'section',
            classNames: ['basket-page-container'],
            innerHTML: template,
        }).getElement();
        this.state = new State();
    }

    public setContent(data: Cart): void {
        this.basketContainer.innerHTML = '';
        const basketItemsArray: HTMLElement[] = data.lineItems.map((item: LineItem) => new BasketItem(item).element);
        this.basketContainer.append(...basketItemsArray);
        const totalCartPrice: HTMLElement = this._element.querySelector('.basket-total-price') as HTMLElement;
        totalCartPrice.innerText = `Total price: ${data.totalPrice.centAmount / 100} €`;
    }

    // 1.check if basketId exist
    // 2. if yes: check if isLoggedIn
    // 3. if yes: existingFlow -> get cart by id;

    // 2b. if no: check if isLoggedIn
    // 3. if yes: anonymousFlow -> get cart by id;

    public getBasket(): Promise<Cart | void | undefined> | undefined {
        if (this.state.isLogIn && this.state.basketId) {
            return this.apiBasket.getCartById(this.state.basketId)?.then(({ body }) => body);
        } else if (this.state.basketId) {
            return this.apiBasket.getCartById(this.state.basketId)?.then(({ body }) => body);
        } else if (this.state.isLogIn) {
            return this.apiBasket.createCartForLogInUser();
        } else {
            return this.apiBasket.createCart();
        }
    }
    // public getBasket(): Promise<Cart | void | undefined> | undefined {
    //     return this.apiBasket
    //         .getCarts()
    //         ?.then((resp: ClientResponse<CartPagedQueryResponse>) => resp.body)
    //         .then((resp: CartPagedQueryResponse) => resp.results)
    //         .then((resp: Cart[]) => resp[0])
    //         .then((cart: Cart) => {
    //             if (cart?.id) {
    //                 return cart;
    //             } else {
    //                 if (this.state.isLogIn) {
    //                     return this.apiBasket.createCartForLogInUser();
    //                 }
    //                 return this.apiBasket.createCart();
    //             }
    //         });
    // }

    public get element(): HTMLElement {
        return this._element;
    }

    public get basketContainer(): HTMLElement {
        return this._element.querySelector('.basket-container') as HTMLElement;
    }
}
