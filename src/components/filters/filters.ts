import ElementCreator from '../../utils/template-creation';
import template from './filters.html';

export class Filters {
    private readonly _element: HTMLElement;
    constructor() {
        this._element = new ElementCreator({
            tag: 'div',
            classNames: ['filters-container', 'd-flex', 'column-gap-3'],
            innerHTML: template,
        }).getElement();
    }

    public get element(): HTMLElement | null {
        return this._element;
    }
}
