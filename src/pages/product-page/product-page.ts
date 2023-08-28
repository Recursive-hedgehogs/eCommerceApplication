import ElementCreator from '../../utils/template-creation';
import template from './product-page.html';
import './product-page.scss';
import {
    ProductDiscountValueAbsolute,
    ProductDiscountValueExternal,
    ProductDiscountValueRelative,
} from '@commercetools/platform-sdk';
import { IProductWithDiscount } from '../../constants/interfaces/interface';

export default class ProductPage {
    public element!: HTMLElement;
    private productName!: HTMLElement;
    private productImage!: HTMLElement;
    private productDescription!: HTMLElement;
    private productPrice!: HTMLElement;
    private productPriceDiscount!: HTMLElement;
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
        this.productPrice = this.element.querySelector('.product-price') as HTMLElement;
        this.productPriceDiscount = this.element.querySelector('.product-price-discount') as HTMLElement;

        ProductPage.singleton = this;
    }

    public getElement(): HTMLElement {
        return this.element;
    }

    public setContent(data: IProductWithDiscount): void {
        this.productName.innerText = data.product.masterData.current.name['en-US'];
        if (data.product.masterData.current.masterVariant.images) {
            this.productImage.style.background = `url('${data.product.masterData.current.masterVariant.images[0].url}') no-repeat`;
            this.productImage.style.backgroundSize = 'cover';
        }
        if (
            data.product.masterData.current.masterVariant.attributes &&
            data.product.masterData.current.masterVariant.attributes[0]
        ) {
            this.productDescription.innerText =
                data.product.masterData.current.masterVariant.attributes[0].name +
                '   ' +
                data.product.masterData.current.masterVariant.attributes[0].value['key'];
        }

        if (data.product.masterData.current.masterVariant.prices) {
            this.productPrice.innerText = `Original price: ${
                data.product.masterData.current.masterVariant.prices[0].value.centAmount / 100
            }€`;
            const pricesD:
                | ProductDiscountValueAbsolute
                | ProductDiscountValueExternal
                | ProductDiscountValueRelative
                | undefined = data.discount?.value;
            const b: { permyriad: string } = pricesD as unknown as { permyriad: string };

            const priceDiscount =
                b && b.permyriad
                    ? data.product.masterData.current.masterVariant.prices[0].value.centAmount / 100 -
                      (+b.permyriad / 10000) *
                          (data.product.masterData.current.masterVariant.prices[0].value.centAmount / 100)
                    : '';

            this.productPriceDiscount.innerText = 'Discount price:' + priceDiscount + '€';
        }
    }
}
