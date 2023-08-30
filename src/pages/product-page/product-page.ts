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
    private productPrice!: HTMLElement;
    private productPriceDiscount!: HTMLElement;
    private static singleton: ProductPage;
    private productInf!: HTMLElement;

    constructor() {
        if (ProductPage.singleton) {
            return ProductPage.singleton;
        }
        this.element = new ElementCreator({
            tag: 'section',
            classNames: ['product-page', 'flex-grow-1', 'p-3'],
            innerHTML: template,
        }).getElement();
        this.productImage = this.element.querySelector('.product-image') as HTMLElement;
        this.productInf = this.element.querySelector('.product-information') as HTMLElement;
        this.productName = this.element.querySelector('.product-name') as HTMLElement;
        this.productDescription = this.element.querySelector('.product-description') as HTMLElement;
        this.productPrice = this.element.querySelector('.product-price') as HTMLElement;
        this.productPriceDiscount = this.element.querySelector('.product-price-discount') as HTMLElement;
        ProductPage.singleton = this;
        this.showPopup();
    }

    public getElement(): HTMLElement {
        return this.element;
    }

    public setContent(data: IProductWithDiscount): void {
        this.productName.innerText = data.product.masterData.current.name['en-US'];
        if (data.product.masterData.current.masterVariant.images) {
            // this.productImage.style.background = `url('${data.product.masterData.current.masterVariant.images[0].url}') no-repeat`;
            // this.productImage.style.backgroundSize = 'contain';
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

            const priceDiscount =
                b && b.permyriad
                    ? data.product.masterData.current.masterVariant.prices[0].value.centAmount / 100 -
                      (+b.permyriad / 10000) *
                          (data.product.masterData.current.masterVariant.prices[0].value.centAmount / 100)
                    : '';

            this.productPriceDiscount.innerText = 'Discount price:' + priceDiscount + '€';
        }
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

    public showPopup(): void {
        this.productImage.addEventListener('click', this.openModal); //add Listener for image
    }

    private openModal = (event: MouseEvent) => {
        const target = event.target as HTMLElement;

        if (target.classList.contains('product-image')) {
            const swiperSlide = target.querySelector('.swiper-slide-active');
            if (swiperSlide instanceof HTMLElement) {
                const imageUrl = swiperSlide.style.backgroundImage.slice(4, -1).replace(/"/g, '');
                this.showModal(imageUrl);
            }
        }
    };

    private showModal(imageUrl: string) {
        const modal = document.getElementById('product-modal') as HTMLElement;
        const modalImage = document.getElementById('modal-product-image') as HTMLImageElement;

        console.log('Modal image URL:', imageUrl);

        modalImage.src = imageUrl;
        modal.style.display = 'block';

        const closeModal = modal.querySelector('.close') as HTMLElement;
        closeModal.onclick = () => {
            modal.style.display = 'none';
        };

        window.onclick = (event: MouseEvent) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    }
}
