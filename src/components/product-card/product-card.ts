import ElementCreator from '../../utils/template-creation';
import template from './product-card.html';
import './product-card.scss';
import { DiscountedPrice, Price, ProductProjection } from '@commercetools/platform-sdk';

export class ProductCard {
    private readonly _element: HTMLElement | null = null;
    private readonly productName: HTMLElement;
    private readonly productImage: HTMLElement;
    private readonly productDescription: HTMLElement;
    public productId: string;
    public productKey: string | undefined;
    private readonly productPrice: HTMLElement;
    private readonly productDefaultPrice: HTMLElement;
    public readonly prices: Price[] | undefined;
    public productAddToCart: HTMLElement;

    constructor(data: ProductProjection) {
        this.prices = data.masterVariant.prices;
        this.productId = data.id;
        this.productKey = data.key;
        this._element = new ElementCreator({
            tag: 'div',
            classNames: ['product'],
            innerHTML: template,
        }).getElement();
        this.productName = new ElementCreator({
            tag: 'h5',
            classNames: ['product-name'],
            innerHTML: data.name['en-US'],
        }).getElement();
        this.productImage = new ElementCreator({
            tag: 'div',
            classNames: ['product-image'],
            background:
                data.masterVariant.images && data.masterVariant.images[0] ? data.masterVariant.images[0].url : 'none',
        }).getElement();
        this.productDescription = new ElementCreator({
            tag: 'h6',
            classNames: ['product-description'],
            innerHTML: data.description ? data.description['en-US'] : '',
        }).getElement();
        const prices: Price[] | undefined = data.masterVariant.prices;
        this.productPrice = new ElementCreator({
            tag: 'p',
            classNames: ['product-price'],
            innerHTML: `Original price ${prices && prices[0] ? prices[0].value.centAmount / 100 + '€' : ''}`,
        }).getElement();
        this.productDefaultPrice = new ElementCreator({
            tag: 'p',
            classNames: ['product-price-discount', 'text-warning'],
        }).getElement();
        const discount: DiscountedPrice | null =
            prices && prices[0] && prices[0].discounted ? prices[0].discounted : null;
        const priceD: number | null = discount ? discount.value.centAmount : null;
        if (priceD) {
            this.productDefaultPrice.innerText = `Discounted price ${priceD / 100}€`;
            this.productPrice.classList.add('text-decoration-line-through');
        } else {
            this.productDefaultPrice.innerText = '';
            this.productPrice.classList.remove('text-decoration-line-through');
        }
        this.productAddToCart = new ElementCreator({
            tag: 'button',
            classNames: ['product-add-to-cart'],
            innerHTML: 'Add to Cart',
        }).getElement();
        this.productAddToCart.id = 'add-product-to-cart';

        this._element.append(
            this.productName,
            this.productImage,
            this.productDescription,
            this.productPrice,
            this.productDefaultPrice,
            this.productAddToCart
        );
    }

    public get element(): HTMLElement | null {
        return this._element;
    }
}
