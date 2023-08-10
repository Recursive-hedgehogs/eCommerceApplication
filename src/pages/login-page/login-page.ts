import ElementCreator from '../../utils/template-creation';
import { getTemplate } from './login-page.template';
import './login-page.scss';
export default class LoginPage {
    element: HTMLElement;

    constructor() {
        this.element = new ElementCreator({
            tag: 'div',
            classNames: ['login-page-container'],
            innerHTML: getTemplate(),
        }).getElement();
    }

    public getElement(): HTMLElement {
        return this.element;
    }
}
