import ElementCreator from '../../utils/template-creation';
import template from './registration-page.html';
import './registration-page.scss';
export default class RegistrationPage {
    element: HTMLElement;

    constructor() {
        this.element = new ElementCreator({
            tag: 'div',
            classNames: ['registration-page-container'],
            innerHTML: template,
        }).getElement();
    }

    public getElement(): HTMLElement {
        return this.element;
    }
}
