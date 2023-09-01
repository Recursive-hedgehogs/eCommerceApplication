import ElementCreator from '../../utils/template-creation';
import template from './product-card.html';
import './product-card.scss';
import { Price, ProductProjection } from '@commercetools/platform-sdk';

export class ProductCard {
    private readonly _element: HTMLElement | null = null;
    private readonly productName: HTMLElement;
    private readonly productImage: HTMLElement;
    private readonly productDescription: HTMLElement;
    public productId: string;
    public productKey: string | undefined;
    private readonly productPrice: HTMLElement;
    private readonly productDefaultPrice: HTMLElement;

    constructor(data: ProductProjection) {
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
            tag: 'p',
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
            // innerHTML: ,
        }).getElement();
        const discount = prices && prices[0] && prices[0].discounted ? prices[0].discounted : '';
        const priceD: number | null = discount ? discount.value.centAmount : null;
        if (priceD) {
            this.productDefaultPrice.innerText = `Discounted price ${priceD / 100}€`;
            this.productPrice.classList.add('text-decoration-line-through');
        } else {
            this.productDefaultPrice.innerText = '';
            this.productPrice.classList.remove('text-decoration-line-through');
        }

        // const pricesD:
        //     | ProductDiscountValueAbsolute
        //     | ProductDiscountValueExternal
        //     | ProductDiscountValueRelative
        //     | undefined = data.discount?.value;
        // if (pricesD) {
        //     const b: { permyriad: string } = pricesD as unknown as { permyriad: string };
        //     this.productDefaultPrice.innerText = `Discounted price ${
        //         prices && prices[0] && pricesD && b.permyriad
        //             ? prices[0].value.centAmount / 100 -
        //               (+b.permyriad / 10000) * (prices[0].value.centAmount / 100) +
        //               '€'
        //             : ''
        //     }`;
        //     this.productPrice.classList.add('text-decoration-line-through');
        // } else {
        //     this.productDefaultPrice.innerText = '';
        //     this.productPrice.classList.remove('text-decoration-line-through');
        // }

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
