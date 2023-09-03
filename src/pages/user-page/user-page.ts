import ElementCreator from '../../utils/template-creation';
import template from './user-page.html';
import { apiCustomer } from '../../api/api-customer';
import { Address, Customer } from '@commercetools/platform-sdk';

export default class UserPage {
    element: HTMLElement;
    userData: Customer | null;

    constructor() {
        this.element = new ElementCreator({
            tag: 'section',
            classNames: ['user-page-container'],
            innerHTML: template,
        }).getElement();
        this.userData = null;
    }

    public getElement(): HTMLElement {
        return this.element;
    }

    public showUserData(id: string): void {
        apiCustomer.getUser(id)?.then((res) => {
            this.userData = res.body;
            this.fillMainFields();
            this.userData.addresses.forEach((address) => {
                if (address.id) {
                    if (this.userData?.billingAddressIds?.includes(address.id)) {
                        this.fillBillingAddressFields(address);
                    } else if (this.userData?.shippingAddressIds?.includes(address.id)) {
                        this.fillShippingAddressFields(address);
                    }
                }
            });
        });
    }

    private fillMainFields(): void {
        const firstName: HTMLInputElement = <HTMLInputElement>this.element.querySelector('#user-first-name');
        firstName.value = this.userData?.firstName || '';
        const lastName: HTMLInputElement = <HTMLInputElement>this.element.querySelector('#user-last-name');
        lastName.value = this.userData?.lastName || '';
        const dateOfBirth: HTMLInputElement = <HTMLInputElement>this.element.querySelector('#user-date-of-birth');
        dateOfBirth.value = this.userData?.dateOfBirth || '';
        const email: HTMLInputElement = <HTMLInputElement>this.element.querySelector('#user-email');
        email.value = this.userData?.email || '';
        const password: HTMLInputElement = <HTMLInputElement>this.element.querySelector('#user-password');
        password.value = this.userData?.password || '';
    }

    private fillAddressFields(address: Address, isBilling: boolean): void {
        const prefix = isBilling ? '' : '-ship';
        const checkboxId = isBilling ? 'switchDefaultAddress' : 'switchDefaultAddressShipping';
        this.element.querySelector(`#input-street${prefix}`)?.setAttribute('value', address.streetName || '');
        this.element.querySelector(`#input-postal-code${prefix}`)?.setAttribute('value', address.postalCode || '');
        this.element.querySelector(`#input-city${prefix}`)?.setAttribute('value', address.city || '');
        this.setSelectedOptionByValue(`#input-country${prefix}`, address.country === 'PL' ? 'Poland' : 'Germany');

        const checkbox: HTMLInputElement = <HTMLInputElement>this.element.querySelector(`#${checkboxId}`);
        const label = this.element.querySelector(`label[for="${checkboxId}"]`);
        //check if address set as the default
        const isDefault = isBilling
            ? this.userData?.defaultBillingAddressId === address.id
            : this.userData?.defaultShippingAddressId === address.id;

        checkbox.checked = isDefault;
        if (label) {
            label.textContent = isDefault ? 'This address set as the default' : 'Set the address as the default';
        }
    }

    private fillBillingAddressFields(address: Address): void {
        this.fillAddressFields(address, true);
    }

    private fillShippingAddressFields(address: Address): void {
        this.fillAddressFields(address, false);
    }

    // Helper function to set selected option for a select element by value
    private setSelectedOptionByValue(selectId: string, value: string): void {
        const select = this.element.querySelector(selectId);
        if (select) {
            const option = select.querySelector(`option[value="${value}"]`);
            if (option) {
                option.setAttribute('selected', 'selected');
            }
        }
    }

    public openMaintoEdit(): void {
        const cancelButton = this.element.querySelector('#btn-cancel-main');
        const saveButton = this.element.querySelector('#btn-save-main');
        const editButton = this.element.querySelector('#btn-edit-main');
        const inputFields = this.element.querySelectorAll('.main-info input');
        for (const inputField of inputFields) {
            if (inputField instanceof HTMLInputElement) {
                inputField.disabled = !inputField.disabled;
            }
        }
        cancelButton?.classList.remove('hidden');
        saveButton?.classList.remove('hidden');
        editButton?.classList.add('hidden');
    }

    public closeMaintoEdit(): void {
        this.fillMainFields();
        const inputFields = this.element.querySelectorAll('.main-info input');
        for (const inputField of inputFields) {
            if (inputField instanceof HTMLInputElement) {
                inputField.disabled = !inputField.disabled;
            }
        }
        this.element.querySelector('#btn-cancel-main')?.classList.add('hidden');
        this.element.querySelector('#btn-save-main')?.classList.add('hidden');
        this.element.querySelector('#btn-edit-main')?.classList.remove('hidden');
    }
}
