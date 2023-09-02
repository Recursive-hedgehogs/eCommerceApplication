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
            const userData = res.body;
            document.getElementById('user-first-name')?.setAttribute('value', userData.firstName || '');
            document.getElementById('user-last-name')?.setAttribute('value', userData.lastName || '');
            document.getElementById('user-date-of-birth')?.setAttribute('value', userData.dateOfBirth || '');
            document.getElementById('user-email')?.setAttribute('value', userData.email || '');
            document.getElementById('user-password')?.setAttribute('value', userData.password || '');
            const billingDefaultCheckbox: HTMLInputElement = <HTMLInputElement>(
                document.getElementById('switchDefaultAddress')
            );
            const shippingDefaultCheckbox: HTMLInputElement = <HTMLInputElement>(
                document.getElementById('switchDefaultAddressShipping')
            );
            const billingLabel = document.querySelector('label[for="switchDefaultAddress"]');
            const shippingLabel = document.querySelector('label[for="switchDefaultAddressShipping"]');

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

                    // const isBillingDefault = userData.defaultBillingAddressId === address.id;
                    // const isShippingDefault = userData.defaultShippingAddressId === address.id;

                    // billingDefaultCheckbox.checked = isBillingDefault;
                    // shippingDefaultCheckbox.checked = isShippingDefault;

                    // if (billingLabel && isBillingDefault) {
                    //     billingLabel.textContent = 'This address set as the default';
                    // } else if (billingLabel) {
                    //     billingLabel.textContent = 'Set the address as the default';
                    // }

                    // if (shippingLabel && isShippingDefault) {
                    //     shippingLabel.textContent = 'This address set as the default';
                    // } else if (shippingLabel) {
                    //     shippingLabel.textContent = 'Set the address as the default';
                    // }
                }
            }

            userData.addresses.forEach((address) => {
                console.log(address);
                fillAddressFields(address);
            });
        });
    }

    // Helper function to set value for an element by ID
    private setValueById(elementId: string, value: string) {
        const element = document.getElementById(elementId);
        if (element) {
            element.setAttribute('value', value || '');
        }
    }

    // Helper function to set selected option for a select element by value
    private setSelectedOptionByValue(selectId: string, value: string) {
        const select = document.getElementById(selectId);
        if (select) {
            const option = select.querySelector(`option[value="${ value }"]`);
            if (option) {
                option.setAttribute('selected', 'selected');
            }
        }
    }

    public showUserDataO(id: string): void {
        apiCustomer.getUser(id)?.then((res) => console.log(res));
    }
}
