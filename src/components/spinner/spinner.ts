import ElementCreator from '../../utils/template-creation';
import template from './spinner.html';
import './spinner.scss';

export class Spinner {
    private readonly _element: HTMLElement;
    constructor() {
        this._element = new ElementCreator({
            tag: 'div',
            classNames: ['spinner-container'],
            innerHTML: template,
        }).getElement();
    }

    public get element(): HTMLElement {
        return this._element;
    }
}
