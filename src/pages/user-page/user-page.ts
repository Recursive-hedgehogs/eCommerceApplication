import ElementCreator from '../../utils/template-creation';
import template from './user-page.html';
import { apiCustomer, ApiCustomer } from '../../api/api-customer';
import { ICreateCustomerCredentials } from '../../constants/interfaces/credentials.interface';

export default class UserPage {
    element: HTMLElement;
    userData: ICreateCustomerCredentials | null;
    apiCustomer: ApiCustomer;

    constructor() {
        this.element = new ElementCreator({
            tag: 'section',
            classNames: ['user-page-container'],
            innerHTML: template,
        }).getElement();
        this.userData = null;
        this.apiCustomer = apiCustomer;
    }

    public getElement(): HTMLElement {
        return this.element;
    }

    async getUserData(ID: string) {
        try {
            const user = await this.apiCustomer.getUser(ID);
            const { firstName, lastName, email, password, addresses, dateOfBirth } = user?.body || {};
            if (firstName && lastName && email && password && addresses && dateOfBirth) {
                this.userData = {
                    email,
                    password,
                    firstName,
                    lastName,
                    addresses,
                    dateOfBirth,
                };
            }

            if (this.userData) this.showUserData(this.userData);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    private showUserData(user: ICreateCustomerCredentials) {
        console.log(this.element);
        const firstName = new ElementCreator({
            tag: 'div',
            classNames: ['user-first-name'],
            textContent: user.firstName,
        }).getElement();
        const lasttName = new ElementCreator({
            tag: 'div',
            classNames: ['user-last-name'],
            textContent: user.lastName,
        }).getElement();
        this.element.append(firstName, lasttName);
        console.log(this.element);
    }
}
