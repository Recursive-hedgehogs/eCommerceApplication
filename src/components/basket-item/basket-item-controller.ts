import { BasketItem } from './basket-item';
import App from '../../app/app';

export class BasketItemController {
    private basketItem: BasketItem;
    private app: App = new App();

    constructor(basketItem: BasketItem) {
        this.basketItem = basketItem;
        this.addListeners();
    }

    private addListeners(): void {
        this.basketItem.element.addEventListener('click', this.onClick);
    }

    public onClick = (e: Event): void => {
        const lineItemId: string = this.basketItem.data?.id;
        let newQuantity: number = this.basketItem.data?.quantity;
        switch (e.target) {
            case this.basketItem.deleteButton:
                this.app.basketPage.deleteCartFromBasket(lineItemId);
                break;
            case this.basketItem.quantityDecreaseButton:
                this.app.basketPage.changeQuantity(lineItemId, --newQuantity);
                break;
            case this.basketItem.quantityIncreaseButton:
                this.app.basketPage.changeQuantity(lineItemId, ++newQuantity);
                break;
            default:
                break;
        }
    };
}
