import ElementCreator from '../../utils/template-creation';
import template from './basket-page.html';
import './basket-page.scss';
import { Cart, LineItem } from '@commercetools/platform-sdk';
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

    public getBasket(): Promise<Cart | void | undefined> | undefined {
        if (this.state.basketId) {
            return this.apiBasket
                .getCartById(this.state.basketId)
                ?.then(({ body }) => body)
                .catch(
                    () =>
                        this.apiBasket.createCart()?.then((cart) => {
                            localStorage.setItem('cartID', cart.id);
                            this.state.basketId = cart.id;
                        })
                );
        }
        return this.apiBasket.createCart()?.then((cart) => {
            localStorage.setItem('cartID', cart.id);
            this.state.basketId = cart.id;
        });
    }

    public get element(): HTMLElement {
        return this._element;
    }

    public get basketContainer(): HTMLElement {
        return this._element.querySelector('.basket-container') as HTMLElement;
    }
}
