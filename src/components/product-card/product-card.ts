import ElementCreator from '../../utils/template-creation';
import template from './product-card.html';
import './product-card.scss';
import { IProductWithDiscount } from '../../constants/interfaces/interface';
import {
    Price,
    ProductDiscountValueAbsolute,
    ProductDiscountValueExternal,
    ProductDiscountValueRelative,
} from '@commercetools/platform-sdk';

export class ProductCard {
    private readonly _element: HTMLElement | null = null;
    private readonly productName: HTMLElement;
    private readonly productImage: HTMLElement;
    private readonly productDescription: HTMLElement;
    public productId: string;
    public productKey: string | undefined;
    private readonly productPrice: HTMLElement;
    private readonly productDefaultPrice: HTMLElement;

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
        const variant = data.product.masterData.current.variants[0].attributes;
        this.productDescription = new ElementCreator({
            tag: 'p',
            classNames: ['product-description'],
            innerHTML: variant && variant[0] ? variant[0].name + '   ' + variant[0].value['key'] : '',
        }).getElement();
        const prices: Price[] | undefined = data.product.masterData.current.masterVariant.prices;
        this.productPrice = new ElementCreator({
            tag: 'p',
            classNames: ['product-price'],
            innerHTML: `Original price ${prices && prices[0] ? prices[0].value.centAmount / 100 + '€' : ''}`,
        }).getElement();
        const pricesD:
            | ProductDiscountValueAbsolute
            | ProductDiscountValueExternal
            | ProductDiscountValueRelative
            | undefined = data.discount?.value;
        const b: { permyriad: string } = pricesD as unknown as { permyriad: string };
        this.productDefaultPrice = new ElementCreator({
            tag: 'p',
            classNames: ['product-price-discount', 'text-warning'],
            innerHTML: `Discounted price ${
                prices && prices[0] && pricesD && b.permyriad
                    ? prices[0].value.centAmount / 100 -
                      (+b.permyriad / 10000) * (prices[0].value.centAmount / 100) +
                      '€'
                    : ''
            }`,
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
