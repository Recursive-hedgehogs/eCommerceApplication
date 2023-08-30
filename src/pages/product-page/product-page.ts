import ElementCreator from '../../utils/template-creation';
import template from './product-page.html';
import './product-page.scss';
import {
    Image,
    ProductDiscountValueAbsolute,
    ProductDiscountValueExternal,
    ProductDiscountValueRelative,
} from '@commercetools/platform-sdk';
import { IProductWithDiscount } from '../../constants/interfaces/interface';
import { SwiperContainer } from 'swiper/swiper-element';
import { SwiperOptions } from 'swiper/types';

export default class ProductPage {
    public element!: HTMLElement;
    private productName!: HTMLElement;
    private productImage!: HTMLElement;
    private productDescription!: HTMLElement;
    private productFullDescription!: HTMLElement;
    private productPrice!: HTMLElement;
    private productPriceDiscount!: HTMLElement;
    private productInf!: HTMLElement;
    private static singleton: ProductPage;

    constructor() {
        if (ProductPage.singleton) {
            return ProductPage.singleton;
        }
        this.element = new ElementCreator({
            tag: 'section',
            classNames: ['product-page', 'flex-grow-1', 'p-3'],
            innerHTML: template,
        }).getElement();
        this.productImage = this.element.querySelector('.product-image-container') as HTMLElement;
        this.productInf = this.element.querySelector('.product-information') as HTMLElement;
        this.productName = this.element.querySelector('.product-name') as HTMLElement;
        this.productDescription = this.element.querySelector('.product-description') as HTMLElement;
        this.productFullDescription = this.element.querySelector('.product-full-description') as HTMLElement;
        this.productPrice = this.element.querySelector('.product-price') as HTMLElement;
        this.productPriceDiscount = this.element.querySelector('.product-price-discount') as HTMLElement;
        // this.productPublish = this.element.querySelector('.product-publish') as HTMLElement;
        ProductPage.singleton = this;
    }

    public getElement(): HTMLElement {
        return this.element;
    }

    public setContent(data: IProductWithDiscount): void {
        this.productName.innerText = data.product.masterData.current.name['en-US'];
        if (data.product.masterData.current.masterVariant.images) {
            const imagesArray: HTMLElement[] = this.getImages(data.product.masterData.current.masterVariant.images);
            this.productImage.innerHTML = '';
            this.productImage.append(...imagesArray);
            this.createSlider();
        }

        if (data.product.masterData.current.description) {
            this.productDescription.innerText = data.product.masterData.current.description['en-US'];
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

            if (b && b.permyriad) {
                const priceDiscount =
                    data.product.masterData.current.masterVariant.prices[0].value.centAmount / 100 -
                    (+b.permyriad / 10000) *
                        (data.product.masterData.current.masterVariant.prices[0].value.centAmount / 100);
                this.productPriceDiscount.innerText = 'Discount price:' + priceDiscount + '€';
                this.productPrice.classList.add('text-decoration-line-through');
            } else {
                this.productPriceDiscount.innerText = '';
                this.productPrice.classList.remove('text-decoration-line-through');
            }
        }
        if (data.product.masterData.current.metaDescription) {
            this.productFullDescription.innerText = data.product.masterData.current.metaDescription['en-US'];
        }
        // if (data.product.masterData.current.metaTitle) {
        //     this.productPublish.innerText = data.product.masterData.current.metaTitle['en-US'];
        // }
    }

    public getImages(images: Image[]): HTMLElement[] {
        return images.map((image: Image) =>
            new ElementCreator({
                tag: 'swiper-slide',
                classNames: ['product-images'],
                background: image.url,
            }).getElement()
        );
    }

    private createSlider() {
        const swiperEl: SwiperContainer = this.element.querySelector('swiper-container') as SwiperContainer;
        const swiperParams: SwiperOptions = {
            navigation: true,
            pagination: true,
            slidesPerView: 1,
            // breakpoints: {
            //     640: {
            //         slidesPerView: 2,
            //     },
            //     1024: {
            //         slidesPerView: 3,
            //     },
            // },
            on: {
                init() {
                    // ...
                },
            },
        };
        Object.assign(swiperEl, swiperParams);
        swiperEl.initialize();
    }
}
