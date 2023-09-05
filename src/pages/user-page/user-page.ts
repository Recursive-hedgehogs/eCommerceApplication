import template from './user-page.html';
import { apiCustomer } from '../../api/api-customer';
import { Address, Customer, CustomerUpdateAction } from '@commercetools/platform-sdk';
import addressTemplate from './address-template.html';
import ElementCreator from '../../utils/template-creation';
import './user-page.scss';
import { ICreateCustomerCredentials } from '../../constants/interfaces/credentials.interface';

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

    public setUserData(id: string, callback?: () => void): Promise<void> {
        return new Promise((resolve) => {
            apiCustomer.getUser(id)?.then((res) => {
                this.userData = res.body;
                if (callback) {
                    callback();
                }
                resolve();
            });
        });
    }

    public showAddresses() {
        const billingContainer: HTMLInputElement = <HTMLInputElement>this.element.querySelector('.billing-addresses');
        const shippingContainer: HTMLInputElement = <HTMLInputElement>this.element.querySelector('.shipping-addresses');
        const billingAddressIds: string[] | undefined = this.userData?.billingAddressIds;
        const shippingAddressIds: string[] | undefined = this.userData?.shippingAddressIds;
        const addresses = this.userData?.addresses;
        const billingAddresses = addresses?.filter((address) => {
            return address.id !== undefined && billingAddressIds?.includes(address.id);
        });
        const shippingAddresses = addresses?.filter((address) => {
            return address.id !== undefined && shippingAddressIds?.includes(address.id);
        });
        billingAddresses?.forEach((address) => {
            const newAddress = new ElementCreator({
                tag: 'section',
                classNames: ['card', 'border-secondary', 'mb-3', 'mt-2'],
                innerHTML: addressTemplate,
            }).getElement();
            billingContainer.appendChild(newAddress);
            this.fillAddressFields(address, newAddress, true);
        });
        shippingAddresses?.forEach((address) => {
            const newAddress = new ElementCreator({
                tag: 'section',
                classNames: ['card', 'border-secondary', 'mb-3', 'mt-2'],
                innerHTML: addressTemplate,
            }).getElement();
            shippingContainer.appendChild(newAddress);
            this.fillAddressFields(address, newAddress, false);
        });
    }

    public showUserData(): void {
        this.fillMainFields();
        this.showAddresses();
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
        // const password: HTMLInputElement = <HTMLInputElement>this.element.querySelector('#user-password');
        // password.value = this.userData?.password || '';
    }

    private fillAddressFields(address: Address, container: HTMLElement, isBilling: boolean): void {
        const checkboxId = isBilling ? 'switchDefaultAddress' : 'switchDefaultAddressShipping';
        const street: HTMLInputElement = <HTMLInputElement>container.querySelector(`#input-street`);
        street.value = address.streetName || '';
        const postalCode: HTMLInputElement = <HTMLInputElement>container.querySelector(`#input-postal-code`);
        postalCode.value = address.postalCode || '';
        const addressID: HTMLInputElement = <HTMLInputElement>container.querySelector(`#address-id`);
        addressID.value = address.id || '';
        const city: HTMLInputElement = <HTMLInputElement>container.querySelector(`#input-city`);
        city.value = address.city || '';
        this.setSelectedOptionByValue(`#input-country`, address.country === 'PL' ? 'Poland' : 'Germany');
        const inputFields = container.querySelectorAll('input');
        const selectField: HTMLSelectElement = <HTMLSelectElement>container.querySelector('select');
        this.changeDisabled(inputFields, selectField);

        const checkbox: HTMLInputElement = <HTMLInputElement>container.querySelector(`#${checkboxId}`);
        const label = this.element.querySelector(`label[for="${checkboxId}"]`);
        //check if address set as the default
        const isDefault = isBilling
            ? this.userData?.defaultBillingAddressId === address.id
            : this.userData?.defaultShippingAddressId === address.id;

        // checkbox.checked = isDefault;
        // if (label) {
        //     label.textContent = isDefault ? 'This address set as the default' : 'Set the address as the default';
        // }
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

    public showNewAddress(parentContainer: HTMLElement): void {
        const addressesCont: HTMLElement = <HTMLElement>parentContainer.querySelector('.addresses-container');
        const newAddress = new ElementCreator({
            tag: 'section',
            classNames: ['card', 'border-secondary', 'mb-3', 'mt-2'],
            innerHTML: addressTemplate,
        }).getElement();
        const deleteButton: HTMLElement = <HTMLElement>newAddress.querySelector('.btn-delete');
        const editButton: HTMLElement = <HTMLElement>newAddress.querySelector('.btn-edit');
        const resetNewAddressBtns: HTMLElement = <HTMLElement>newAddress.querySelector('.btn-reset-new');
        const saveNewAddressBtns: HTMLElement = <HTMLElement>newAddress.querySelector('.btn-save-new');
        deleteButton.classList.add('hidden');
        editButton.classList.add('hidden');
        resetNewAddressBtns.classList.remove('hidden');
        saveNewAddressBtns.classList.remove('hidden');
        addressesCont.appendChild(newAddress);
    }

    public deleteNewAddress(card: HTMLElement): void {
        const addressesCont: HTMLElement = <HTMLElement>this.element.querySelector('.addresses-container');
        if (addressesCont.contains(card)) {
            addressesCont.removeChild(card);
        }
    }

    private changeDisabled(inputFields: NodeListOf<HTMLElement>, selectField?: HTMLSelectElement): void {
        for (const inputField of inputFields) {
            if (inputField instanceof HTMLInputElement) {
                inputField.disabled = !inputField.disabled;
            }
        }
        if (selectField) selectField.disabled = !selectField.disabled;
    }
    //create customer data from input fields to object
    public prepareCustomerData(): ICreateCustomerCredentials {
        const personalFields: NodeListOf<HTMLInputElement> = this.element.querySelectorAll('.personal');
        const namesFields: string[] = ['firstName', 'lastName', 'dateOfBirth', 'email'];
        const personalArray: string[][] = [...personalFields].map((el: HTMLInputElement, i: number) => [
            namesFields[i],
            el.value,
        ]);
        return Object.fromEntries(personalArray);
    }

    public prepareAddressData(addressSelector: string): Record<string, string> {
        const addressFields: string[] = ['id', 'country', 'city', 'streetName', 'postalCode'];
        const addressElements: NodeListOf<HTMLInputElement> = this.element.querySelectorAll(addressSelector);
        const addressArray: string[][] = [...addressElements].map((el: HTMLInputElement, i: number) => [
            addressFields[i],
            el.value,
        ]);
        return Object.fromEntries(addressArray);
    }

    public prepareNewAddressData(addressSelector: string): Record<string, string> {
        const addressFields: string[] = ['country', 'city', 'streetName', 'postalCode'];
        const addressElements: NodeListOf<HTMLInputElement> = this.element.querySelectorAll(addressSelector);
        const addressArray: string[][] = [...addressElements].map((el: HTMLInputElement, i: number) => [
            addressFields[i],
            el.value,
        ]);
        return Object.fromEntries(addressArray);
    }

    public createAddressUpdateActions(addressData: Record<string, string>[]): CustomerUpdateAction[] {
        return addressData.map((item: Record<string, string>) => ({
            action: 'changeAddress',
            addressId: item.id,
            address: {
                streetName: item.streetName,
                postalCode: item.postalCode,
                city: item.city,
                country: item.country,
            },
        }));
    }
}
