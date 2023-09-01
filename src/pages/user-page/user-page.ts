import ElementCreator from '../../utils/template-creation';
import template from './user-page.html';
import { apiCustomer, ApiCustomer } from '../../api/api-customer';
import { ICreateCustomerCredentials } from '../../constants/interfaces/credentials.interface';
import { Address } from '@commercetools/platform-sdk';

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

    public showUserData(id: string) {
        apiCustomer.getUser(id)?.then((res) => {
            const userData = res.body; // Assuming userData is an object with properties like firstName and lastName
            document.getElementById('user-first-name')?.setAttribute('value', userData.firstName || '');
            document.getElementById('user-last-name')?.setAttribute('value', userData.lastName || '');
            document.getElementById('user-date-of-birth')?.setAttribute('value', userData.dateOfBirth || '');
            document.getElementById('user-email')?.setAttribute('value', userData.email || '');
            document.getElementById('user-password')?.setAttribute('value', userData.password || '');

            function fillAddressFields(address: Address) {
                if (address.id) {
                    if (userData?.billingAddressIds?.includes(address.id)) {
                        // Set address values in the form fields
                        document.getElementById('input-street')?.setAttribute('value', address.streetName || '');
                        document.getElementById('input-postal-code')?.setAttribute('value', address.postalCode || '');
                        document.getElementById('input-city')?.setAttribute('value', address.city || '');
                        const billingCountry = document.getElementById('input-country');
                        if (address.country === 'PL') {
                            const optionToSelect = billingCountry?.querySelector('option[value="Poland"]');
                            optionToSelect?.setAttribute('selected', 'selected');
                        } else {
                            const optionToSelect = billingCountry?.querySelector('option[value="Germany"]');
                            optionToSelect?.setAttribute('selected', 'selected');
                        }
                    } else if (userData?.shippingAddressIds?.includes(address.id)) {
                        // Set address values in the form fields
                        document.getElementById('input-street-ship')?.setAttribute('value', address.streetName || '');
                        document
                            .getElementById('input-postal-code-ship')
                            ?.setAttribute('value', address.postalCode || '');
                        document.getElementById('input-city-ship')?.setAttribute('value', address.city || '');
                        const shippingCountry = document.getElementById('input-country-ship');
                        if (address.country === 'PL') {
                            const optionToSelect = shippingCountry?.querySelector('option[value="Poland"]');
                            optionToSelect?.setAttribute('selected', 'selected');
                        } else {
                            const optionToSelect = shippingCountry?.querySelector('option[value="Germany"]');
                            optionToSelect?.setAttribute('selected', 'selected');
                        }
                    }
                }
            }

            userData.addresses.forEach((address) => {
                console.log(address);
                fillAddressFields(address);
            });
        });
    }
}
