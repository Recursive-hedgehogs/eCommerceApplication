import ElementCreator from '../../utils/template-creation';
import template from './pagination.html';
import { PageItem } from './pages-item/page-item';

export class Pagination {
    private readonly _element: HTMLElement;
    private _currentPage = 0;
    public pages?: PageItem[];
    public prev: HTMLLIElement;
    public next: HTMLLIElement;

    constructor() {
        this._element = new ElementCreator({
            tag: 'div',
            classNames: ['pagination-container', 'd-flex', 'justify-content-end'],
            innerHTML: template,
        }).getElement();
        this.prev = this._element.querySelector('.prev') as HTMLLIElement;
        this.next = this._element.querySelector('.next') as HTMLLIElement;
    }

    public setContent(pagesCount: number, currentPage: number): void {
        this._currentPage = currentPage - 1;
        if (pagesCount > 1) {
            this._element.classList.remove('d-none');
            this.pages = Array.from({ length: pagesCount }, (_, i: number) => new PageItem(i));
            this.element.querySelectorAll('.pages').forEach((el: Element) => el.remove());
            const pageElements: HTMLElement[] = this.pages?.map(({ element }: PageItem) => element);
            pageElements.forEach((element: HTMLElement, i: number): void => {
                element.classList.remove('active');
                if (i + 1 === currentPage) {
                    element.classList.add('active');
                }
            });
            this.prev.after(...pageElements);
        } else {
            this.element.classList.add('d-none');
        }
    }

    public get currentPage(): number {
        return this._currentPage;
    }

    public set currentPage(value: number) {
        if (this._currentPage === value) {
            return;
        }
        this._currentPage = value;
        this.element.dispatchEvent(new CustomEvent('changePage', { bubbles: true, detail: this.currentPage + 1 }));
    }

    public get element(): HTMLElement {
        return this._element;
    }
}
