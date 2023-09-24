import ElementCreator from '../../../utils/template-creation';

export class PageItem {
    private readonly _element: HTMLElement;

    constructor(i: number) {
        this._element = new ElementCreator({
            tag: 'li',
            classNames: ['page-item', 'pages', 'user-select-none'],
            innerHTML: `<a class="page-link" >${i + 1}</a>`,
        }).getElement();
    }

    public get element() {
        return this._element;
    }
}
