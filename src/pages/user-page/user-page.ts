import { apiCustomer } from '../../api/api-customer';
import ElementCreator from '../../utils/template-creation';
import template from './user-page.html';

export default class UserPage {
    element: HTMLElement;
    userData: HTMLElement | null;
    firstName: string | null;

    constructor() {
        this.element = new ElementCreator({
            tag: 'section',
            classNames: ['user-page-container'],
            innerHTML: template,
        }).getElement();
        this.userData = null;
        this.firstName = null;
    }

    public getElement(): HTMLElement {
        return this.element;
    }

    private showUserData() {
        // apiCustomer.getUser();
    }
}
