import { ApiBasket } from '../../api/api-basket';
import App from '../../app/app';

export class ProductPageController {
    private app: App;
    private productPage: HTMLElement;
    private apiBasket: ApiBasket = new ApiBasket();

    constructor() {
        this.app = new App();
        this.productPage = this.app.productPage.getElement();
        this.addListeners();
    }

    private addListeners(): void {
        this.productPage.addEventListener('click', this.onProductPageClick);
    }

    private onProductPageClick = (e: Event): void => {
        const productId = this.app.productPage.productId;
        e.preventDefault();
        const target = <HTMLElement>e.target;
        if (productId) {
            switch (target.id) {
                case 'btn-remove':
                    this.removeItemFromCart(target, productId);
                    break;
                case 'btn-add':
                    this.addItemToCart(target, productId);
                    break;
            }
        }
    };

    private removeItemFromCart = (target: HTMLElement, productId: string) => {
        const btnAdd = this.productPage.querySelector('#btn-add');
        this.app.basketPage.getBasket()?.then((cart) => {
            const foundObject = cart?.lineItems.find((item) => item.productId === productId);
            if (cart && foundObject?.id) {
                this.apiBasket.deleteItemInCart(cart.id, cart.version, foundObject.id)?.then(() => {
                    target.classList.add('hidden');
                    btnAdd?.classList.remove('hidden');
                    this.app?.header.setItemsNumInBasket(cart?.lineItems.length - 1);
                });
            }
        });
    };

    private addItemToCart = (target: HTMLElement, productId: string) => {
        const btnRemove = this.productPage.querySelector('#btn-remove');
        this.app.basketPage.getBasket()?.then((cart) => {
            if (cart && productId) {
                this.apiBasket.updateCart(cart.id, cart.version, productId)?.then(({ body }) => {
                    this.app.basketPage.setContent(body);
                    this.app?.header.setItemsNumInBasket(cart?.lineItems.length + 1);
                    target.classList.add('hidden');
                    btnRemove?.classList.remove('hidden');
                });
            }
        });
    };
}
