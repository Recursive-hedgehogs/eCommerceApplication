import ElementCreator from '../../utils/template-creation';
import template from './product.html';
import './product.scss';
import { Product } from '@commercetools/platform-sdk';

export class ProductCard {
    private _element: HTMLElement | null = null;
    private productName: HTMLElement;
    private productImage: HTMLElement;
    private productDescription: HTMLElement;

    constructor(data: Product) {
        this._element = new ElementCreator({
            tag: 'div',
            classNames: ['product'],
            innerHTML: template,
        }).getElement();
        this.productName = new ElementCreator({
            tag: 'h5',
            classNames: ['product-name'],
            innerHTML: data.masterData.current.name['en-US'],
        }).getElement();
        this.productImage = new ElementCreator({
            tag: 'div',
            classNames: ['product-image'],
            background:
                data.masterData.current.variants[0].images && data.masterData.current.variants[0].images[0]
                    ? data.masterData.current.variants[0].images[0].url
                    : 'none',
        }).getElement();
        this.productDescription = new ElementCreator({
            tag: 'p',
            classNames: ['product-description'],
            innerHTML:
                data.masterData.current.variants[0].attributes![0].name +
                '   ' +
                data.masterData.current.variants[0].attributes![0].value['key'],
        }).getElement();
        this._element.append(this.productName, this.productImage, this.productDescription);
    }

    public get element(): HTMLElement | null {
        return this._element;
    }
}
