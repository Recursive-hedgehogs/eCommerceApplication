import App from '../../app/app';
import RegistrationPage from './registration-page';
import { ROUTE } from '../../constants/enums/enum';
import {
    validateDateOfBirth,
    validateEmail,
    validateName,
    validatePassword,
    validatePostalCode,
} from '../../utils/validations';
import { apiCustomer } from '../../api/api-customer';
import { Router } from '../../router/router';
import { LoginPageControllers } from '../login-page/login-page-controllers';

export class RegistrationPageControllers {
    private app: App;
    private registrationPage: RegistrationPage;
    private router: Router;
    private loginPageControllers: LoginPageControllers;

    constructor() {
        this.app = new App();
        this.registrationPage = this.app.registrationPage;
        this.router = new Router();
        this.loginPageControllers = new LoginPageControllers();
        this.addListeners();
    }

    addListeners(): void {
        this.registrationPage.element.addEventListener('submit', this.onRegistrationSubmit);
        this.registrationPage.element.addEventListener('change', this.onRegistrationChange);
        this.registrationPage.element.addEventListener('input', this.onRegistrationValidate);
        this.registrationPage.element.addEventListener('click', this.onRegistrationClick);
        this.registrationPage.element.addEventListener('click', this.loginPageControllers.togglePassword);
    }

    private onRegistrationValidate = (e: Event): void => {
        const target: HTMLInputElement = <HTMLInputElement>e.target;
        const postalCodeInput: HTMLInputElement = <HTMLInputElement>document.getElementById('input-postal-code');
        const postalCodeShipInput: HTMLInputElement = <HTMLInputElement>(
            document.getElementById('input-postal-code-ship')
        );
        const countrySelect: HTMLSelectElement | null = <HTMLSelectElement>document.getElementById('input-country');
        const countryShipSelect: HTMLSelectElement | null = <HTMLSelectElement>(
            document.getElementById('input-country-ship')
        );
        countrySelect.addEventListener('change', function () {
            postalCodeInput.value = '';
        });
        countryShipSelect.addEventListener('change', function () {
            postalCodeShipInput.value = '';
        });
        switch (target.id) {
            case 'input-registr-email':
                this.app?.loginPage.onEmailValidate(target);
                break;
            case 'input-registr-password':
                this.app?.loginPage.onPasswordValidate(target);
                break;
            case 'input-first-name':
            case 'input-last-name':
                this.app?.registrationPage.onNameValidate(target);
                break;
            case 'input-date-birth':
                this.app?.registrationPage.onDateDateOfBirth(target);
                break;
            case 'input-city':
            case 'input-city-ship':
                this.app?.registrationPage.onNameValidate(target);
                break;
            case 'input-street':
            case 'input-street-ship':
                this.app?.registrationPage.onNameValidate(target);
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

    private checkCountry(target: HTMLInputElement, country: HTMLSelectElement): void {
        target.addEventListener('keypress', (event) => {
            if (country.value === 'Poland') {
                this.app?.registrationPage.formatPostalCode(event, target, '-', 6);
            } else if (country.value === 'Germany') {
                this.app?.registrationPage.formatPostalCode(event, target, '', 5);
            }
        });
    }

    private onRegistrationChange = (e: Event): void => {
        const target: EventTarget | null = e.target;
        if (target instanceof HTMLElement && target.id === 'checkSame') {
            const shippingContainer: HTMLElement | null | undefined = this.app?.view?.pages
                ?.get(ROUTE.REGISTRATION)
                ?.querySelector('.shipping-address');
            const billingContainer: HTMLElement | null | undefined = this.app?.view?.pages
                ?.get(ROUTE.REGISTRATION)
                ?.querySelector('.billing-address');
            shippingContainer?.classList.toggle('hidden');

            const shippingAddress: NodeListOf<HTMLInputElement> | undefined =
                shippingContainer?.querySelectorAll('.shipping');
            shippingAddress?.forEach((el: HTMLInputElement): boolean => (el.required = false));
            if (billingContainer) {
                shippingContainer?.classList.contains('hidden')
                    ? (billingContainer.style.width = '100%')
                    : (billingContainer.style.width = '50%');
            }
        }
    };

    private onRegistrationClick = (e: Event): void => {
        if (e.target instanceof HTMLElement && e.target.dataset.link === ROUTE.LOGIN) {
            this.router.navigate(ROUTE.LOGIN);
        }
    };
    private onRegistrationSubmit = (e: SubmitEvent): void => {
        const target: EventTarget | null = e.target;
        if (target instanceof HTMLFormElement) {
            e.preventDefault();
            const inputEmail: Element | null = target.querySelector('.email input');
            const loginBtn: HTMLElement | null = document.getElementById('login-btn');
            const logoutBtn: HTMLElement | null = document.getElementById('logout-btn');
            const personalFields: NodeListOf<HTMLInputElement> = target.querySelectorAll('.personal');
            const shippingAddress: NodeListOf<HTMLInputElement> = target.querySelectorAll('.shipping');
            const billingAddress: NodeListOf<HTMLInputElement> = target.querySelectorAll('.billing');
            const addressFields: string[] = ['country', 'city', 'streetName', 'postalCode'];
            const namesFields: string[] = [
                'email',
                'password',
                'firstName',
                'lastName',
                'dateOfBirth',
                'defaultBillingAddress',
                'defaultShippingAddress',
                'sameAddress',
            ];
            const personalArray: (string | boolean)[][] = [...personalFields].map((el: HTMLInputElement, i: number) => [
                namesFields[i],
                el.type === 'checkbox' ? el.checked : el.value,
            ]);
            const billingArray: string[][] = [...billingAddress].map((el: HTMLInputElement, i: number) => [
                addressFields[i],
                el.value,
            ]);
            const shippingArray: string[][] = [...shippingAddress].map((el: HTMLInputElement, i: number) => [
                addressFields[i],
                el.value,
            ]);
            const customerData = Object.fromEntries(personalArray);
            const billingData = Object.fromEntries(billingArray);
            const shippingData = Object.fromEntries(shippingArray);

            billingData.country = this.app?.getCodeFromCountryName(billingData.country);
            shippingData.country = this.app?.getCodeFromCountryName(shippingData.country);

            customerData.addresses = [billingData, shippingData];
            customerData.shippingAddresses = [1];
            customerData.billingAddresses = [0];

            customerData.defaultShippingAddress = customerData.defaultShippingAddress ? 1 : null;
            customerData.defaultBillingAddress = customerData.defaultBillingAddress ? 0 : null;

            if (customerData.sameAddress) {
                customerData.addresses[1] = customerData.addresses[0];
                shippingAddress.forEach((el: HTMLInputElement, i: number) => (el.value = billingAddress[i].value));
                delete customerData.sameAddress;
            }

            if (
                validateEmail(customerData.email) ||
                validatePassword(customerData.password) ||
                validateName(customerData.addresses[0].city) ||
                validateName(customerData.addresses[1].city) ||
                validateName(customerData.addresses[0].streetName) ||
                validateName(customerData.addresses[1].streetName) ||
                validateName(customerData.firstName) ||
                validateName(customerData.lastName) ||
                validateDateOfBirth(customerData.dateOfBirth) ||
                validatePostalCode(customerData.addresses[0].postalCode) ||
                validatePostalCode(customerData.addresses[1].postalCode)
            ) {
                return;
            }

            apiCustomer
                .createCustomer(customerData)
                .then((): void => {
                    if (this.loginPageControllers) {
                        this.loginPageControllers.onLoginSubmit(e); //call auto-login after registration
                    }
                })
                .then((): void => {
                    this.app?.showMessage('Your account has been created');
                    this.router.navigate(ROUTE.MAIN); //add redirection to MAIN page
                    logoutBtn?.classList.remove('hidden');
                    loginBtn?.classList.add('hidden');
                })
                .catch((): void => {
                    inputEmail?.classList.add('is-invalid');
                    if (inputEmail?.nextElementSibling) {
                        inputEmail.nextElementSibling.innerHTML =
                            'There is already an existing customer with the provided email.';
                    }
                    this.app?.showMessage(
                        'Something went wrong during the registration process, try again later',
                        'red'
                    );
                });
        }
    };
}
