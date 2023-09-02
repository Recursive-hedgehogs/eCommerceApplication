import ElementCreator from '../../utils/template-creation';
import template from './header.template.html';
import './header.scss';

export default class Header {
    private readonly element: HTMLElement;

    constructor() {
        this.element = new ElementCreator({
            tag: 'header',
            classNames: ['header'],
            innerHTML: template,
        }).getElement();
    }

    public getElement(): HTMLElement {
        return this.element;
    }
}
