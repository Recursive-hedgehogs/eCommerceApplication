import { ProductProjection } from '@commercetools/platform-sdk';
import { ApiBasket } from '../../api/api-basket';
import App from '../../app/app';
import { IProductWithDiscount } from '../../constants/interfaces/interface';

export class ProductPageController {
    private app: App;
    private productPage: HTMLElement;
    private apiBasket: ApiBasket = new ApiBasket();
    private data: IProductWithDiscount | undefined;

    constructor() {
        this.app = new App();
        this.productPage = this.app.productPage.getElement();
        this.data = this.app.productPage.data;
        this.addListeners();
    }

    private addListeners(): void {
        this.productPage.addEventListener('click', this.onProductPageClick);
    }

    private onProductPageClick = (e: Event): void => {
        const productId = this.app.productPage.productId;
        console.log('productId', productId);
        e.preventDefault();
        const target: HTMLElement = <HTMLElement>e.target;
        switch (target.id) {
            case 'btn-remove':
                console.log('btn-remove');
                this.app.basketPage.getBasket()?.then((cart) => {
                    const foundObject = cart?.lineItems.find((item) => item.productId === productId);
                    if (cart && foundObject?.id) {
                        console.log(cart?.lineItems);
                        console.log('foundObject', foundObject?.id);
                        this.apiBasket.deleteItemInCart(cart.id, cart.version, foundObject.id);
                    }
                });
                break;
            case 'btn-add':
                console.log('btn-add');
                break;
            default:
                console.log('not');
        }
    };
}
