import { ApiBasket } from '../../api/api-basket/api-basket';
import App from '../../app/app';
import { Cart, ClientResponse, LineItem } from '@commercetools/platform-sdk';

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

    private onProductPageClick = (e: MouseEvent): void => {
        const productId: string | undefined = this.app.productPage.productId;
        e.preventDefault();
        const target: HTMLElement = <HTMLElement>e.target;
        if (productId) {
            switch (target.id) {
                case 'btn-remove':
                    this.removeItemFromCart(target, productId);
                    break;
                case 'btn-add':
                    this.addItemToCart(target, productId);
                    break;
                case 'btn-close':
                    this.app.productPage.closeModal();
                    break;
                case 'product-image-container':
                    this.app.productPage.showModalWindow();
                    break;
            }
        }
    };

    private removeItemFromCart = (target: HTMLElement, productId: string): void => {
        const btnAdd: Element | null = this.productPage.querySelector('#btn-add');
        this.app.basketPage.getBasket()?.then((cart?: Cart): void => {
            const foundObject: LineItem | undefined = cart?.lineItems.find(
                (item: LineItem): boolean => item.productId === productId
            );
            if (cart && foundObject?.id) {
                this.apiBasket
                    .removeCartItem(cart.id, foundObject.id, cart.version)
                    ?.then(({ body }: ClientResponse<Cart>): void => {
                        this.app?.showMessage('Item removed from the cart successfully');
                        target.classList.add('hidden');
                        btnAdd?.classList.remove('hidden');
                        this.app?.header.setItemsNumInBasket(body.totalLineItemQuantity ?? 0);
                        this.app.setBasket();
                    })
                    .catch((error) => {
                        console.error('Error removing item from the cart:', error);
                        alert('Error removing item from the cart');
                    });
            }
        });
    };

    private addItemToCart = (target: HTMLElement, productId: string): void => {
        const btnRemove: Element | null = this.productPage.querySelector('#btn-remove');
        this.app.basketPage.getBasket()?.then((cart?: Cart): void => {
            if (cart && productId) {
                this.apiBasket
                    .updateCart(cart.id, cart.version, productId)
                    ?.then(({ body }: ClientResponse<Cart>): void => {
                        this.app.basketPage.setContent(body);
                        this.app.header.setItemsNumInBasket(body.totalLineItemQuantity ?? 0);
                        target.classList.add('hidden');
                        btnRemove?.classList.remove('hidden');
                    });
            }
        });
    };
}
