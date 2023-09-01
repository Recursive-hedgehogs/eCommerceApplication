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
    private data?: IProductWithDiscount; //temporary container for response data

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
        this.showModalWindow();
    }

    public getElement(): HTMLElement {
        return this.element;
    }

    public retrieveContent(data: IProductWithDiscount): void {
        this.data = data;
    } //separation for responsibility to get data

    public setContent(): void {
        const {
            data,
            productName,
            productImage,
            productDescription,
            productPrice,
            productPriceDiscount,
            productFullDescription,
        } = this; //refactoring code: destructuring assignment
        productName.innerText = data?.product.masterData.current.name['en-US'] ?? '';
        if (data?.product.masterData.current.masterVariant.images) {
            const imagesArray: HTMLElement[] = this.getImages(data.product.masterData.current.masterVariant.images);
            productImage.innerHTML = '';
            productImage.append(...imagesArray);
            this.createSlider('.product-image-container');
        }

        if (data?.product.masterData.current.description) {
            productDescription.innerText = data.product.masterData.current.description['en-US'];
        }

        if (data?.product.masterData.current.masterVariant.prices) {
            productPrice.innerText = `Original price: ${
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
                productPriceDiscount.innerText = 'Discount price:' + priceDiscount + '€';
                productPrice.classList.add('text-decoration-line-through');
            } else {
                productPriceDiscount.innerText = '';
                productPrice.classList.remove('text-decoration-line-through');
            }
        }
        if (data?.product.masterData.current.metaDescription) {
            productFullDescription.innerText = data.product.masterData.current.metaDescription['en-US'];
        }
        // if (data.product.metaTitle) {
        //     this.productPublish.innerText = data.product.metaTitle['en-US'];
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

    private createSlider(containerSelector: string): void {
        const swiperEl: SwiperContainer = this.element.querySelector(containerSelector) as SwiperContainer;
        const swiperParams: SwiperOptions = {
            navigation: true,
            pagination: true,
            slidesPerView: 1,
            on: {
                init() {
                    //
                },
            },
        };
        Object.assign(swiperEl, swiperParams);
        swiperEl.initialize();
    }

    public openModal() {
        const { element, data } = this; //local variable initialization
        const modalProductImage = element.querySelector('.product-modal-image-container') as HTMLElement;
        const images: Image[] = data?.product.masterData.current.masterVariant.images ?? [];
        const modal = document.getElementById('product-modal');
        const imagesArray: HTMLElement[] = this.data ? this.getImages(images) : [];
        modalProductImage.innerHTML = '';
        modalProductImage.append(...imagesArray);

        if (modal) {
            modal.style.display = 'block';
            const closeButton = this.getCloseButtonElement();

            if (closeButton) {
                closeButton.addEventListener('click', this.closeModal.bind(this));
            }
            this.createSlider('.product-modal-image-container');
        }
    }

    public closeModal(): void {
        const closeButton = this.getCloseButtonElement();
        const modal = this.getModalElement();

        if (closeButton && modal) {
            modal.style.display = 'none';
        }
    }

    public showModalWindow() {
        const productImageContainer = this.getProductImageContainer();

        if (productImageContainer) {
            productImageContainer.addEventListener('click', (event) => {
                const target = event.target as HTMLElement;
                if (target.classList.contains('product-images')) {
                    const imageUrl = this.getBackgroundImageUrl(target);
                    if (imageUrl) {
                        this.openModal();
                    }
                }
            });
        }

        const closeButton = this.getCloseButtonElement();

        if (closeButton) {
            closeButton.addEventListener('click', this.closeModal.bind(this));
        }
    }

    private getBackgroundImageUrl(element: HTMLElement): string | undefined {
        const style = getComputedStyle(element);
        const backgroundImage = style.getPropertyValue('background-image');
        const match = backgroundImage.match(/url\("(.+)"\)/);

        return match ? match[1] : undefined;
    }

    private getModalElement(): HTMLElement | null {
        return document.getElementById('product-modal');
    }

    private getCloseButtonElement(): HTMLElement | null {
        return document.querySelector('.close') as HTMLElement | null;
    }

    private getProductImageContainer(): HTMLElement | null {
        return this.element.querySelector('.product-image-container') as HTMLElement | null;
    }
}
