import ElementCreator from '../../utils/template-creation';
import template from './product-page.html';
import './product-page.scss';
import { Product } from '@commercetools/platform-sdk';

export default class ProductPage {
    public element!: HTMLElement;
    private productName!: HTMLElement;
    private productImage!: HTMLElement;
    private productDescription!: HTMLElement;
    private static singleton: ProductPage;

    constructor() {
        if (ProductPage.singleton) {
            return ProductPage.singleton;
        }
        this.element = new ElementCreator({
            tag: 'section',
            classNames: ['product-page'],
            innerHTML: template,
        }).getElement();
        this.productName = this.element.querySelector('.product-name') as HTMLElement;
        this.productImage = this.element.querySelector('.product-image') as HTMLElement;
        this.productDescription = this.element.querySelector('.product-description') as HTMLElement;
        ProductPage.singleton = this;
    }

    public getElement(): HTMLElement {
        return this.element;
    }

    public setContent(data: Product): void {
        this.productName.innerText = data.masterData.current.name['en-US'];
        if (data.masterData.current.variants[0].images) {
            this.productImage.style.background = `url('${data.masterData.current.variants[0].images[0].url}') no-repeat`;
            this.productImage.style.backgroundSize = 'cover';
        }
        if (data.masterData.current.variants[0].attributes) {
            this.productDescription.innerText =
                data.masterData.current.variants[0].attributes[0].name +
                '   ' +
                data.masterData.current.variants[0].attributes[0].value['key'];
        }
    }
}
