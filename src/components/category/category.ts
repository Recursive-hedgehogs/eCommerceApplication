import ElementCreator from '../../utils/template-creation';
import { Category } from '@commercetools/platform-sdk';
import { CategoryController } from './category-controller';
import './category.scss';

export class CategoryComponent {
    private readonly _element: HTMLElement;
    public categoryButton!: HTMLElement;
    public category: Category;
    private readonly categories: Category[];
    constructor(category: Category, categories: Category[]) {
        this.category = category;
        this.categories = categories;
        this._element = new ElementCreator({
            tag: 'div',
            classNames: ['btn-group', 'dropend'],
        }).getElement();
        this.createCategory();
    }

    public get element(): HTMLElement {
        return this._element;
    }

    private createCategory() {
        this.categoryButton = new ElementCreator({
            tag: 'button',
            classNames: ['btn', 'btn-secondary'],
            innerHTML: `${this.category.name['en-US']}`,
        }).getElement();
        this.element.append(this.categoryButton);

        const childs: Category[] = this.categories.filter(
            (el: Category): boolean => el.parent?.id === this.category.id
        );
        if (childs.length) {
            const categoryArrow: HTMLElement = new ElementCreator({
                tag: 'button',
                classNames: ['btn', 'btn-secondary', 'dropdown-toggle', 'dropdown-toggle-split'],
            }).getElement();
            categoryArrow.setAttribute('data-bs-toggle', 'dropdown');
            const categoryInner: HTMLElement = new ElementCreator({
                tag: 'ul',
                classNames: ['dropdown-menu', 'bg-semitransparent'],
            }).getElement();
            childs.forEach((category: Category): void => {
                const childCategory: CategoryComponent = new CategoryComponent(category, this.categories);
                new CategoryController(childCategory);
                if (childCategory.element) {
                    categoryInner.append(childCategory.element);
                }
            });
            this.element.append(categoryArrow, categoryInner);
        }
    }
}
