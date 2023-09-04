import template from './user-page.html';
import { apiCustomer } from '../../api/api-customer';
import { Address, Customer } from '@commercetools/platform-sdk';
import addressTemplate from './address-template.html';
import ElementCreator from '../../utils/template-creation';
import './user-page.scss';

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

    public setUserData(id: string): void {
        apiCustomer.getUser(id)?.then((res) => {
            this.userData = res.body;
            this.showUserData();
        });
    }

    public showUserData(): void {
        this.fillMainFields();
        this.userData?.addresses.forEach((address) => {
            if (address.id) {
                if (this.userData?.billingAddressIds?.includes(address.id)) {
                    this.fillBillingAddressFields(address);
                } else if (this.userData?.shippingAddressIds?.includes(address.id)) {
                    this.fillShippingAddressFields(address);
                }
            }
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
        const street: HTMLInputElement = <HTMLInputElement>this.element.querySelector(`#input-street${prefix}`);
        street.value = address.streetName || '';
        const postalCode: HTMLInputElement = <HTMLInputElement>(
            this.element.querySelector(`#input-postal-code${prefix}`)
        );
        postalCode.value = address.postalCode || '';
        const city: HTMLInputElement = <HTMLInputElement>this.element.querySelector(`#input-city${prefix}`);
        city.value = address.city || '';
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
            const option: HTMLOptionElement = <HTMLOptionElement>select.querySelector(`option[value="${value}"]`);
            if (option) {
                option.selected = true;
            }
        }
    }

    public openFieldstoEdit(container: HTMLElement): void {
        const cancelButton = container.querySelector('.btn-cancel');
        const saveButton = container.querySelector('.btn-save');
        const editButton = container.querySelector('.btn-edit');
        const deleteButton = container.querySelector('.btn-delete');
        const inputFields = container.querySelectorAll('input');
        const selectField: HTMLSelectElement = <HTMLSelectElement>container.querySelector('select');
        this.changeDisabled(inputFields, selectField);
        cancelButton?.classList.remove('hidden');
        saveButton?.classList.remove('hidden');
        editButton?.classList.add('hidden');
        deleteButton?.classList.add('hidden');
    }

    public closeFieldstoEdit(container: HTMLElement): void {
        const cancelButton = container.querySelector('.btn-cancel');
        const saveButton = container.querySelector('.btn-save');
        const editButton = container.querySelector('.btn-edit');
        const deleteButton = container.querySelector('.btn-delete');
        const inputFields = container.querySelectorAll('input');
        const selectField: HTMLSelectElement = <HTMLSelectElement>container.querySelector('select');
        this.changeDisabled(inputFields, selectField);
        cancelButton?.classList.add('hidden');
        saveButton?.classList.add('hidden');
        editButton?.classList.remove('hidden');
        deleteButton?.classList.remove('hidden');
        const invalidInputs: NodeListOf<HTMLElement> = container.querySelectorAll('.is-invalid');
        const invalidFeedbacks: NodeListOf<HTMLElement> = container.querySelectorAll('.invalid-feedback');
        [...invalidInputs].forEach((el) => {
            el.classList.remove('is-invalid');
        });
        [...invalidFeedbacks].forEach((el) => {
            if (el.parentElement) el.parentElement.removeChild(el);
        });
        this.showUserData();
    }

    public showNewAddress(): void {
        const addressesCont: HTMLElement = <HTMLElement>this.element.querySelector('.addresses-container');
        const newAddress = new ElementCreator({
            tag: 'section',
            classNames: ['billing-address', 'card', 'border-secondary', 'mb-3', 'mt-2'],
            innerHTML: addressTemplate,
        }).getElement();
        addressesCont.appendChild(newAddress);
    }

    private changeDisabled(inputFields: NodeListOf<HTMLElement>, selectField?: HTMLSelectElement): void {
        for (const inputField of inputFields) {
            if (inputField instanceof HTMLInputElement) {
                inputField.disabled = !inputField.disabled;
            }
        }
        if (selectField) selectField.disabled = !selectField.disabled;
    }
}
