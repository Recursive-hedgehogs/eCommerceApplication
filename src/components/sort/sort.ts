import ElementCreator from '../../utils/template-creation';
import template from './sort.html';

export class Sort {
    private readonly _element: HTMLElement;
    public selectedOption: string;

    constructor() {
        this._element = new ElementCreator({
            tag: 'div',
            classNames: ['sort-container', 'd-flex', 'flex-column'],
            innerHTML: template,
        }).getElement();
        this.selectedOption = '';
    }

    public get element(): HTMLElement | null {
        return this._element;
    }
}
