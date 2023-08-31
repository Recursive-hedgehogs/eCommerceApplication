import ElementCreator from '../../utils/template-creation';
import template from './filters.html';

export class Filters {
    private readonly element: HTMLElement;
    constructor() {
        this.element = new ElementCreator({
            tag: 'div',
            classNames: ['filters-container'],
            innerHTML: template,
        }).getElement();
    }

    public getElement(): HTMLElement {
        return this.element;
    }
}
