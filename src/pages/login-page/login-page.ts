import ElementCreator from '../../utils/template-creation';
import template from './login-page.template.html';
import './login-page.scss';
export default class LoginPage {
    element: HTMLElement;

    constructor() {
        this.element = new ElementCreator({
            tag: 'div',
            classNames: ['login-page-container'],
            innerHTML: template,
        }).getElement();
    }

    public getElement(): HTMLElement {
        return this.element;
    }
}
