import ElementCreator from '../../utils/template-creation';
import template from './catalog-page.html';
import './catalog-page.scss';
import { ProductCard } from '../../components/product-card/product-card';
import { ProductCardController } from '../../components/product-card/product-card-controller';
import { IProductWithDiscount } from '../../constants/interfaces/interface';

export default class CatalogPage {
    public element!: HTMLElement;
    private readonly catalogContainer!: Element | null;
    private products?: ProductCard[];
    private static singleton: CatalogPage;

    constructor() {
        if (CatalogPage.singleton) {
            return CatalogPage.singleton;
        }

        this.element = new ElementCreator({
            tag: 'section',
            classNames: ['catalog-page', 'flex-grow-1', 'd-flex', 'flex-row', 'column-gap-4'],
            innerHTML: template,
        }).getElement();
        this.catalogContainer = this.element.querySelector('.catalog-container');
        CatalogPage.singleton = this;
    }

    public getElement(): HTMLElement {
        return this.element;
    }

    public setContent(products: IProductWithDiscount[]): void {
        this.products = products.map((product: IProductWithDiscount) => {
            const productCard: ProductCard = new ProductCard(product);
            new ProductCardController(productCard);
            return productCard;
        });
        const productElements: HTMLElement[] = this.products.map((el: ProductCard) => el.element) as HTMLElement[];
        console.log(productElements, this.catalogContainer);
        if (this.catalogContainer) {
            this.catalogContainer.innerHTML = '';
            this.catalogContainer.append(...productElements);
        }
    }
}
