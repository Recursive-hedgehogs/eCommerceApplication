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
import {
    ClientResponse,
    Customer,
    CustomerSetDefaultShippingAddressAction,
    CustomerSignInResult,
    CustomerUpdate,
    CustomerUpdateAction,
} from '@commercetools/platform-sdk';
import { ICreateCustomerCredentials, ILoginCredentials } from '../../constants/interfaces/credentials.interface';
import { IAddress } from '../../constants/interfaces/interface';
import { CustomerSetDefaultBillingAddressAction } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/customer';

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
        this.userPage.element.addEventListener('submit', this.onSubmit);
        this.userPage.element.addEventListener('input', this.onEditValidate);
        passwordIcons.forEach((icon: HTMLElement): void => {
            icon.addEventListener('click', this.togglePassword);
        });
        editButtons.forEach((editButton: HTMLElement): void => {
            editButton.addEventListener('click', this.openEditMode);
        });
        cancelButtons.forEach((cancelButton: HTMLElement): void => {
            cancelButton.addEventListener('click', this.closeEditMode);
        });
        saveButtons.forEach((saveButton: HTMLElement): void => {
            saveButton.addEventListener('click', this.saveUpdatedAddress);
        });
        addButtons.forEach((addButton: HTMLElement): void => {
            addButton.addEventListener('click', this.addNewAddress);
        });
    }

    public addListenersToAddresses(): void {
        const cancelButtons: NodeListOf<HTMLElement> = this.userPage.element.querySelectorAll('.btn-cancel');
        const editButtons: NodeListOf<HTMLElement> = this.userPage.element.querySelectorAll('.btn-edit');
        const deleteButtons: NodeListOf<HTMLElement> = this.userPage.element.querySelectorAll('.btn-delete');
        const saveButtons: NodeListOf<HTMLElement> = this.userPage.element.querySelectorAll('.btn-save');
        const saveMainButton: HTMLElement = <HTMLElement>this.userPage.element.querySelector('.btn-save-main');
        saveMainButton.addEventListener('click', this.saveUpdatedMain);
        this.userPage.element.addEventListener('input', this.onEditValidate);
        cancelButtons.forEach((cancelButton: HTMLElement): void => {
            cancelButton.addEventListener('click', this.closeEditMode);
        });

        editButtons.forEach((editButton: HTMLElement): void => {
            editButton.addEventListener('click', this.openEditMode);
        });
        saveButtons.forEach((saveButton: HTMLElement): void => {
            saveButton.addEventListener('click', this.saveUpdatedAddress);
        });
        deleteButtons.forEach((deleteButton: HTMLElement): void => {
            deleteButton.addEventListener('click', this.deleteAddress);
        });
    }

    private addNewListeners(): void {
        const resetNewAddressBtns: NodeListOf<Element> = this.userPage.element.querySelectorAll('.btn-reset-new');
        const saveNewAddressBtns: NodeListOf<Element> = this.userPage.element.querySelectorAll('.btn-save-new');
        resetNewAddressBtns.forEach((resetButton: Element): void => {
            resetButton.addEventListener('click', this.resetNewField);
        });
        saveNewAddressBtns.forEach((saveButton: Element): void => {
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
        const inputId: string | null = icon.getAttribute('for');
        const input: HTMLInputElement = <HTMLInputElement>this.userPage.element.querySelector(`#${inputId}`);
        this.app?.changePasswordVisibility(input, icon);
    };

    private onEditValidate = (e: Event): void => {
        const target: HTMLInputElement = <HTMLInputElement>e.target;
        const card: HTMLElement = <HTMLElement>target.closest('.card');
        const countrySelect: HTMLSelectElement | null = card ? card.querySelector('#input-country') : null;
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
                if (countrySelect) this.checkCountry(target, countrySelect);
                this.app?.registrationPage.onPostalValidate(target);
                break;
            case 'input-postal-code-ship':
                if (countrySelect) this.checkCountry(target, countrySelect);
                this.app?.registrationPage.onPostalValidate(target);
                break;
            default:
                break;
        }
    };

    private saveNewAddress = (e: Event): void => {
        const target: HTMLInputElement = <HTMLInputElement>e.target;
        const userID: string = <string>this.app.userPage.userData?.id;
        const userVersion: number = <number>this.app.userPage.userData?.version;
        const billAddressesCont: HTMLElement = <HTMLElement>target.closest('.billing-addresses');
        const curentCard: HTMLElement = <HTMLElement>target.closest('.card');
        const addressFields: string[] = ['country', 'city', 'streetName', 'postalCode'];
        const addressElements: NodeListOf<HTMLInputElement> = curentCard.querySelectorAll('.address-field');
        const addressArray: string[][] = [...addressElements].map((el: HTMLInputElement, i: number) => [
            addressFields[i],
            el.value,
        ]);
        const newAddressData = Object.fromEntries(addressArray);
        newAddressData.country = this.app?.getCodeFromCountryName(newAddressData.country);
        if (
            (newAddressData.city && validateName(newAddressData.city)) ||
            (newAddressData.streetName && validateStreet(newAddressData.streetName)) ||
            (newAddressData.postalCode && validatePostalCode(newAddressData.postalCode))
        ) {
            return;
        }
        const newAddress: CustomerUpdate = {
            version: userVersion,
            actions: [
                {
                    action: 'addAddress',
                    address: newAddressData,
                },
            ],
        };
        apiCustomer
            .updateUser(newAddress, userID)
            ?.then((res1: ClientResponse<Customer>) => {
                this.app?.showMessage('You have successfully added new address');
                this.app.userPage.userData = res1.body;
                const length: number = res1.body.addresses.length;
                const addressId: string | undefined = res1.body.addresses[length - 1].id;
                const newUserVersion: number = <number>this.app.userPage.userData?.version;
                if (billAddressesCont) {
                    const newBilling: CustomerUpdate = {
                        version: newUserVersion,
                        actions: [
                            {
                                action: 'addBillingAddressId',
                                addressId: addressId,
                            },
                        ],
                    };
                    return apiCustomer.updateUser(newBilling, userID);
                } else {
                    const newShipping: CustomerUpdate = {
                        version: newUserVersion,
                        actions: [
                            {
                                action: 'addShippingAddressId',
                                addressId: addressId,
                            },
                        ],
                    };
                    return apiCustomer.updateUser(newShipping, userID);
                }
            })
            .then((res2?: ClientResponse<Customer>): void => {
                if (res2) {
                    this.app.userPage.userData = res2.body;
                }
                this.closeEditMode(e);
                this.addListenersToAddresses();
            })
            .catch((): void => {
                this.app?.showMessage('Something went wrong during the edit process, try again later', 'red');
            });
    };

    private saveUpdatedMain = (e: Event): void => {
        const customerData: ICreateCustomerCredentials = this.userPage.prepareCustomerData();
        const userID: string = <string>this.app.userPage.userData?.id;
        const userVersion: number = <number>this.app.userPage.userData?.version;
        if (
            validateEmail(customerData.email) ||
            validateName(customerData.firstName) ||
            validateName(customerData.lastName) ||
            validateDateOfBirth(customerData.dateOfBirth)
        ) {
            alert('Incorrect data');
            return;
        }
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
            ],
        };
        apiCustomer
            .updateUser(data, userID)
            ?.then((res: ClientResponse<Customer>): void => {
                this.app?.showMessage('You have successfully changed your personal data');
                this.app.userPage.userData = res.body;
            })
            .then((): void => {
                this.closeEditMode(e);
                this.userPage.fillMainFields();
            })
            .catch((): void => {
                this.app?.showMessage('Something went wrong during the edit process, try again later', 'red');
            });
    };

    private saveUpdatedAddress = (e: Event): void => {
        const target: HTMLInputElement = <HTMLInputElement>e.target;
        const billAddressesCont: HTMLElement = <HTMLElement>target.closest('.billing-addresses');
        const curentCard: HTMLElement = <HTMLElement>target.closest('.card');
        const addressData: IAddress = this.userPage.prepareAddressData('.address-input', curentCard);
        const checkInput: HTMLInputElement = <HTMLInputElement>curentCard.querySelector('.form-check-input');
        addressData.country = this.app?.getCodeFromCountryName(addressData.country);
        if (
            (addressData.city && validateName(addressData.city)) ||
            (addressData.streetName && validateStreet(addressData.streetName)) ||
            (addressData.postalCode && validatePostalCode(addressData.postalCode))
        ) {
            return;
        }
        const userID: string = <string>this.app.userPage.userData?.id;
        const userVersion: number = <number>this.app.userPage.userData?.version;
        const actions: CustomerUpdateAction[] = [
            {
                action: 'changeAddress',
                addressId: addressData.id,
                address: {
                    streetName: addressData.streetName,
                    postalCode: addressData.postalCode,
                    city: addressData.city,
                    country: addressData.country,
                },
            },
        ];
        if (checkInput.checked) {
            const actionType:
                | CustomerSetDefaultBillingAddressAction['action']
                | CustomerSetDefaultShippingAddressAction['action'] = billAddressesCont
                ? 'setDefaultBillingAddress'
                : 'setDefaultShippingAddress';
            actions.push({
                action: actionType,
                addressId: addressData.id,
            });
        }

        const updatedAddress: CustomerUpdate = {
            version: userVersion,
            actions: actions,
        };

        apiCustomer
            .updateUser(updatedAddress, userID)
            ?.then((res: ClientResponse<Customer>): void => {
                this.app?.showMessage('You have successfully changed your address');
                this.app.userPage.userData = res.body;
            })
            .then((): void => {
                this.closeEditMode(e);
                this.addListenersToAddresses();
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
        target.addEventListener('keypress', (event: KeyboardEvent): void => {
            if (country.value === 'Poland') {
                this.app?.registrationPage.formatPostalCode(event, target, '-', 6);
            } else if (country.value === 'Germany') {
                this.app?.registrationPage.formatPostalCode(event, target, '', 5);
            }
        });
    }

    private onSubmit = (e: SubmitEvent): void => {
        e.preventDefault();
        const target: HTMLElement = e.target as HTMLElement;
        switch (target.id) {
            case 'password-form':
                this.onPasswordSubmit(target);
        }
    };

    private onPasswordSubmit = (target: HTMLElement): void => {
        const currentPassword: HTMLInputElement = <HTMLInputElement>target.querySelector('#user-password');
        const newPassword: HTMLInputElement = <HTMLInputElement>target.querySelector('#new-password');
        const confirmPassword: HTMLInputElement = <HTMLInputElement>target.querySelector('#confirm-new-password');
        if (newPassword.value !== confirmPassword.value) {
            this.app?.showMessage("New passwords aren't the same", 'red');
        }
        if (
            validatePassword(currentPassword.value) ||
            validatePassword(newPassword.value) ||
            validatePassword(confirmPassword.value)
        ) {
            this.app?.showMessage('Not valid', 'red');
            return;
        }

        if (this.userPage.userData) {
            apiCustomer
                .changePassword({
                    id: this.userPage.userData.id,
                    version: this.userPage.userData.version,
                    currentPassword: currentPassword.value, //data from input
                    newPassword: newPassword.value, //data from input
                })
                ?.then(({ body }: ClientResponse<Customer>): void => {
                    const email: string = body.email;
                    const password: string = newPassword.value;
                    this.relogin({ email, password });
                })
                .catch((e: Error) => {
                    switch (e.message) {
                        case '400':
                            this.app?.showMessage('Wrong current password', 'red');
                            break;
                        case '500':
                            this.app?.showMessage('Password is not valid', 'red');
                            break;
                        default:
                    }
                });
        }
    };

    private relogin(data: ILoginCredentials): void {
        apiCustomer
            .signIn(data)
            .then((resp: ClientResponse<CustomerSignInResult>): void => {
                const customer: Customer = resp.body.customer;
                this.app?.userPage.setUserData(customer.id);
                this.app?.setAuthenticationStatus(true); // set authentication state
                this.app?.showMessage('New password created');
            })
            .catch((e: Error) => console.log(e));
    }

    private deleteAddress = (e: Event): void => {
        const target: HTMLInputElement = <HTMLInputElement>e.target;
        const userID: string = <string>this.app.userPage.userData?.id;
        const userVersion: number = <number>this.app.userPage.userData?.version;
        const curentCard: HTMLElement = <HTMLElement>target.closest('.card');
        const cardContainer: HTMLElement = <HTMLElement>target.closest('.addresses-container');
        cardContainer.removeChild(curentCard);
        const addressIdInput: HTMLInputElement = <HTMLInputElement>curentCard.querySelector('#address-id');
        const addressId: string = addressIdInput.value;
        const deletedAddress: CustomerUpdate = {
            version: userVersion,
            actions: [
                {
                    action: 'removeAddress',
                    addressId: addressId,
                },
            ],
        };
        apiCustomer
            .updateUser(deletedAddress, userID)
            ?.then((res: ClientResponse<Customer>): void => {
                this.app?.showMessage('You have deleted address');
                this.app.userPage.userData = res.body;
            })
            .catch((): void => {
                this.app?.showMessage('Something went wrong during the edit process, try again later', 'red');
            });
    };
}
