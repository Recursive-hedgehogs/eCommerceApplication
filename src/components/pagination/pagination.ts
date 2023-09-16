import ElementCreator from '../../utils/template-creation';
import template from './pagination.html';
import { PageItem } from './pages-item/page-item';

export class Pagination {
    private readonly _element: HTMLElement;
    public pages?: PageItem[];
    public prev: HTMLLIElement;
    public next: HTMLLIElement;
    private _currentPage = 0;

    constructor() {
        this._element = new ElementCreator({
            tag: 'div',
            classNames: ['pagination-container', 'd-flex', 'justify-content-end'],
            innerHTML: template,
        }).getElement();
        this.prev = this._element.querySelector('.prev') as HTMLLIElement;
        this.next = this._element.querySelector('.next') as HTMLLIElement;
    }

    public setContent(pagesCount: number): void {
        this.pages = Array.from({ length: pagesCount }, (_, i: number) => new PageItem(i));

        this.element.querySelectorAll('.pages').forEach((el: Element) => el.remove());
        const pages: HTMLElement[] = this.pages?.map(({ element }) => element);
        this.prev.after(...pages);
    }

    public get currentPage(): number {
        return this._currentPage;
    }

    public set currentPage(value: number) {
        this._currentPage = value;
        this.pages?.forEach(({ element }, i: number): void => {
            element.classList.remove('active');
            if (i === value) {
                element.classList.add('active');
            }
        });
    }

    public get element(): HTMLElement {
        return this._element;
    }
}
