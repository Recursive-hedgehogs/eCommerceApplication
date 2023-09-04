import App from '../../app/app';
import UserPage from './user-page';
import {
    validateDateOfBirth,
    validateEmail,
    validateName,
    validatePassword,
    validatePostalCode,
    validateStreet,
} from '../../utils/validations';
import { apiCustomer } from '../../api/api-customer';
import { BaseAddress, CustomerUpdate, CustomerUpdateAction } from '@commercetools/platform-sdk';

export class UserPageController {
    private app: App;
    private userPage: UserPage;

    constructor() {
        this.app = new App();
        this.userPage = this.app.userPage;
        this.addListeners();
    }

    private addListeners(): void {
        const saveButtons: NodeListOf<HTMLElement> = this.userPage.element.querySelectorAll('.btn-save');
        const addButtons: NodeListOf<HTMLElement> = this.userPage.element.querySelectorAll('.btn-add');
        const editButtons: NodeListOf<HTMLElement> = this.userPage.element.querySelectorAll('.btn-edit');
        const cancelButtons: NodeListOf<HTMLElement> = this.userPage.element.querySelectorAll('.btn-cancel');
        const passwordIcons: NodeListOf<HTMLElement> = this.userPage.element.querySelectorAll('.password-icon');
        this.userPage.element.addEventListener('input', this.onEditValidate);
        console.log(addButtons);
        passwordIcons.forEach((icon) => {
            icon.addEventListener('click', this.togglePassword);
        });
        editButtons.forEach((editButton) => {
            editButton.addEventListener('click', this.openEditMode);
        });
        cancelButtons.forEach((cancelButton) => {
            cancelButton.addEventListener('click', this.closeEditMode);
        });
        saveButtons.forEach((saveButton) => {
            saveButton.addEventListener('click', this.saveUpdatedAddress);
        });
        addButtons.forEach((addButton) => {
            addButton.addEventListener('click', this.addNewAddress);
        });
    }

    private addNewListeners(): void {
        const resetNewAddressBtns = this.userPage.element.querySelectorAll('.btn-reset-new');
        const saveNewAddressBtns = this.userPage.element.querySelectorAll('.btn-save-new');
        resetNewAddressBtns.forEach((resetButton) => {
            resetButton.addEventListener('click', this.resetNewField);
        });
        saveNewAddressBtns.forEach((saveButton) => {
            saveButton.addEventListener('click', this.saveNewAddress);
        });
    }

    private openEditMode = (event: Event): void => {
        const target: HTMLElement = <HTMLElement>event.target;
        const card: HTMLElement = <HTMLElement>target.closest('.card');
        this.app?.userPage.openFieldstoEdit(card);
    };

    private closeEditMode = (event: Event): void => {
        const target: HTMLElement = <HTMLElement>event.target;
        const card: HTMLElement = <HTMLElement>target.closest('.card');
        this.app?.userPage.closeFieldstoEdit(card);
    };

    private togglePassword = (event: Event): void => {
        const icon: HTMLElement = <HTMLElement>event.target;
        const inputId = icon.getAttribute('for');
        const input: HTMLInputElement = <HTMLInputElement>this.userPage.element.querySelector(`#${inputId}`);
        this.app?.changePasswordVisibility(input, icon);
    };

    private onEditValidate = (e: Event): void => {
        const target: HTMLInputElement = <HTMLInputElement>e.target;
        const card: HTMLElement = <HTMLElement>target.closest('.card');
        const countrySelect: HTMLSelectElement | null = <HTMLSelectElement>card.querySelector('#input-country');
        const countryShipSelect: HTMLSelectElement | null = <HTMLSelectElement>(
            card.querySelector('#input-country-ship')
        );
        switch (target.id) {
            case 'user-email':
                this.app?.loginPage.onEmailValidate(target);
                break;
            case 'user-first-name':
            case 'user-last-name':
                this.app?.registrationPage.onNameValidate(target);
                break;
            case 'user-date-of-birth':
                this.app?.registrationPage.onDateDateOfBirth(target);
                break;
            case 'user-password':
            case 'new-password':
            case 'confirm-new-password':
                this.app?.loginPage.onPasswordValidate(target);
                break;
            case 'input-city':
            case 'input-city-ship':
                this.app?.registrationPage.onNameValidate(target);
                break;
            case 'input-street':
            case 'input-street-ship':
                this.app?.registrationPage.onStreetValidate(target);
                break;
            case 'input-postal-code':
                this.checkCountry(target, countrySelect);
                this.app?.registrationPage.onPostalValidate(target);
                break;
            case 'input-postal-code-ship':
                this.checkCountry(target, countryShipSelect);
                this.app?.registrationPage.onPostalValidate(target);
                break;
            default:
                break;
        }
    };

    private saveNewAddress = (e: Event): void => {
        const userID: string = <string>this.app.userPage.userData?.id;
        const userVersion: number = <number>this.app.userPage.userData?.version;
        const newAddress: CustomerUpdate = {
            version: userVersion,
            actions: [
                {
                    action: 'addAddress',
                    address: {
                        streetName: 'Any Street',
                        postalCode: '11111',
                        city: 'Any City',
                        country: 'PL',
                    },
                },
            ],
        };
        apiCustomer
            .updateUser(newAddress, userID)
            ?.then((res): void => {
                this.app?.showMessage('You have successfully added new address');
                this.app.userPage.userData = res.body;
            })
            .then((): void => {
                this.closeEditMode(e);
            })
            .catch((): void => {
                this.app?.showMessage('Something went wrong during the edit process, try again later', 'red');
            });
    };

    private saveUpdatedAddress = (e: Event): void => {
        const customerData = this.userPage.prepareCustomerData();
        const billingData = this.userPage.prepareAddressData('.billing-addresses .address-input');
        const shippingData = this.userPage.prepareAddressData('.shipping-addresses .address-input');

        billingData.country = this.app?.getCodeFromCountryName(billingData.country);
        shippingData.country = this.app?.getCodeFromCountryName(shippingData.country);
        const allAddresses = [billingData, shippingData];
        console.log(allAddresses[0].streetName);
        if (
            validateEmail(customerData.email) ||
            validateName(allAddresses[0].city) ||
            validateName(allAddresses[1].city) ||
            validateStreet(allAddresses[0].streetName) ||
            validateStreet(allAddresses[1].streetName) ||
            validateName(customerData.firstName) ||
            validateName(customerData.lastName) ||
            validateDateOfBirth(customerData.dateOfBirth) ||
            validatePostalCode(allAddresses[0].postalCode) ||
            validatePostalCode(allAddresses[1].postalCode)
        ) {
            return;
        }

        const userID: string = <string>this.app.userPage.userData?.id;
        const userVersion: number = <number>this.app.userPage.userData?.version;
        const addressUpdateActions = this.userPage.createAddressUpdateActions(allAddresses);

        const data: CustomerUpdate = {
            version: userVersion,
            actions: [
                {
                    action: 'setFirstName',
                    firstName: customerData.firstName,
                },
                {
                    action: 'setLastName',
                    lastName: customerData.lastName,
                },
                {
                    action: 'setDateOfBirth',
                    dateOfBirth: customerData.dateOfBirth,
                },
                {
                    action: 'changeEmail',
                    email: customerData.email,
                },
                ...addressUpdateActions,
            ],
        };
        apiCustomer
            .updateUser(data, userID)
            ?.then((res): void => {
                this.app?.showMessage('You have successfully changed your personal data');
                this.app.userPage.userData = res.body;
            })
            .then((): void => {
                this.closeEditMode(e);
            })
            .catch((): void => {
                this.app?.showMessage('Something went wrong during the edit process, try again later', 'red');
            });
    };

    private addNewAddress = (e: Event): void => {
        const target: HTMLInputElement = <HTMLInputElement>e.target;
        const parentContainer: HTMLElement = <HTMLElement>target.closest('.tab-pane');
        this.userPage.showNewAddress(parentContainer);
        this.addNewListeners();
    };

    private resetNewField = (e: Event): void => {
        const target: HTMLInputElement = <HTMLInputElement>e.target;
        const card: HTMLElement = <HTMLElement>target.closest('.card');
        this.userPage.deleteNewAddress(card);
    };

    private checkCountry(target: HTMLInputElement, country: HTMLSelectElement): void {
        target.addEventListener('keypress', (event) => {
            if (country.value === 'Poland') {
                this.app?.registrationPage.formatPostalCode(event, target, '-', 6);
            } else if (country.value === 'Germany') {
                this.app?.registrationPage.formatPostalCode(event, target, '', 5);
            }
        });
    }
}
