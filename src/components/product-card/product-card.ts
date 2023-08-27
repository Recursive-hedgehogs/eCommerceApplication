import ElementCreator from '../../utils/template-creation';
import template from './product-card.html';
import './product-card.scss';
import { IProductWithDiscount } from '../../constants/interfaces/interface';

export class ProductCard {
    private readonly _element: HTMLElement | null = null;
    private readonly productName: HTMLElement;
    private readonly productImage: HTMLElement;
    private readonly productDescription: HTMLElement;
    public productId: string;
    public productKey: string | undefined;
    private productPrice: HTMLElement;
    private productDefaultPrice: HTMLElement;

    constructor(data: IProductWithDiscount) {
        this.productId = data.product.id;
        this.productKey = data.product.key;
        this._element = new ElementCreator({
            tag: 'div',
            classNames: ['product'],
            innerHTML: template,
        }).getElement();
        this.productName = new ElementCreator({
            tag: 'h5',
            classNames: ['product-name'],
            innerHTML: data.product.masterData.current.name['en-US'],
        }).getElement();
        this.productImage = new ElementCreator({
            tag: 'div',
            classNames: ['product-image'],
            background:
                data.product.masterData.current.variants[0].images &&
                data.product.masterData.current.variants[0].images[0]
                    ? data.product.masterData.current.variants[0].images[0].url
                    : 'none',
        }).getElement();
        this.productDescription = new ElementCreator({
            tag: 'p',
            classNames: ['product-description'],
            innerHTML:
                data.product.masterData.current.variants[0].attributes![0].name +
                '   ' +
                data.product.masterData.current.variants[0].attributes![0].value['key'],
        }).getElement();
        const prices = data.product.masterData.current.masterVariant.prices;
        this.productPrice = new ElementCreator({
            tag: 'p',
            classNames: ['product-price'],
            innerHTML: `Original price ${prices && prices[0] ? prices[0].value.centAmount / 100 + '€' : ''}`,
        }).getElement();
        const pricesD = data.discount?.value;
        this.productDefaultPrice = new ElementCreator({
            tag: 'p',
            classNames: ['product-price-discount', 'text-warning'],
            innerHTML: `Discounted price ${pricesD && pricesD ? pricesD : ''}`,
        }).getElement();

        this._element.append(
            this.productName,
            this.productImage,
            this.productDescription,
            this.productPrice,
            this.productDefaultPrice
        );
    }

    public get element(): HTMLElement | null {
        return this._element;
    }
}
