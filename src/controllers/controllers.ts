import App from '../app/app';
import { ROUTE } from '../models/enums/enum';
import { apiCustomer } from '../api/api-customer';
import { ClientResponse, Customer, CustomerSignInResult, CustomerToken } from '@commercetools/platform-sdk';
import * as validationUtils from '../utils/validations';

export class Controllers {
    private app: App | null;

    constructor() {
        this.app = null;
    }

    public start(app: App): void {
        this.app = app;
        this.addListeners();
    }

    public addListeners(): void {
        window.addEventListener('load', this.onFirstLoad);
        window.addEventListener('popstate', this.redirectCallBack);

        const loginBtn: HTMLElement | null = document.getElementById('login-btn');
        const registrBtn: HTMLElement | null = document.getElementById('registration-btn');
        loginBtn?.addEventListener('click', (): void => {
            this.app?.setCurrentPage(ROUTE.LOGIN);
        });
        registrBtn?.addEventListener('click', (): void => {
            this.app?.setCurrentPage(ROUTE.REGISTRATION);
        });

        this.app?.view?.pages?.get(ROUTE.MAIN)?.addEventListener('click', this.onMainPageClick);
        this.app?.view?.pages?.get(ROUTE.REGISTRATION)?.addEventListener('submit', this.onRegistrationSubmit);
        this.app?.view?.pages?.get(ROUTE.LOGIN)?.addEventListener('submit', this.onLoginSubmit);
        this.app?.view?.pages?.get(ROUTE.LOGIN)?.addEventListener('focusout', this.onLoginValidate);
        this.app?.view?.pages?.get(ROUTE.LOGIN)?.addEventListener('click', this.togglePassword);
        this.app?.view?.pages?.get(ROUTE.NOT_FOUND)?.addEventListener('click', this.onNotFoundPageClick);
    }

    private togglePassword = (): void => {
        const passwordInput: HTMLInputElement = <HTMLInputElement>document.getElementById('input-login-password');
        const passwordIcon: HTMLElement = <HTMLElement>document.getElementById('password-icon');

        passwordIcon?.addEventListener('click', () => {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                passwordIcon.classList.remove('fa-eye-slash');
                passwordIcon.classList.add('fa-eye');
            } else {
                passwordInput.type = 'password';
                passwordIcon.classList.remove('fa-eye');
                passwordIcon.classList.add('fa-eye-slash');
            }
        });
    };

    private onLoginValidate = (e: Event): void => {
        const target: HTMLInputElement = <HTMLInputElement>e.target;
        const parentDiv = target.closest('.form-item');
        if (!parentDiv) return;
        const inputError: HTMLElement = <HTMLElement>parentDiv.querySelector('.invalid-feedback');
        const errorMessage =
            target.id === 'input-login-email'
                ? validationUtils.validateEmail(target.value)
                : validationUtils.validatePassword(target.value);
        // const passwordIcon: HTMLElement = <HTMLElement>document.getElementById('password-icon');
        console.log(errorMessage);
        if (inputError) {
            target.classList.add('is-invalid');
            inputError.textContent = errorMessage;
            inputError.style.display = errorMessage ? 'block' : 'none';
            // passwordIcon.style.display = errorMessage ? 'none' : 'inline-block';
            if (!errorMessage) {
                target.classList.remove('is-invalid');
            }
        } else if (errorMessage) {
            const newErrorDiv = document.createElement('div');
            newErrorDiv.classList.add('invalid-feedback');
            newErrorDiv.textContent = errorMessage;
            parentDiv.appendChild(newErrorDiv);
            // passwordIcon.style.display = 'none';
        }
    };

    private onMainPageClick = (e: Event): void => {
        e.preventDefault();
        const target: EventTarget | null = e.target;
        if (target instanceof HTMLElement) {
            switch (target.dataset.link) {
                case ROUTE.LOGIN:
                    this.app?.setCurrentPage(ROUTE.LOGIN);
                    break;
                case ROUTE.REGISTRATION:
                    this.app?.setCurrentPage(ROUTE.REGISTRATION);
                    break;
                case ROUTE.CATALOG:
                    this.app?.setCurrentPage(ROUTE.CATALOG);
                    break;
                case ROUTE.PRODUCT:
                    this.app?.setCurrentPage(ROUTE.PRODUCT);
                    break;
                case ROUTE.USER:
                    this.app?.setCurrentPage(ROUTE.USER);
                    break;
                case ROUTE.BASKET:
                    this.app?.setCurrentPage(ROUTE.BASKET);
                    break;
                case ROUTE.ABOUT:
                    this.app?.setCurrentPage(ROUTE.ABOUT);
                    break;
                default:
                    break;
            }
        }
    };

    private onNotFoundPageClick = (e: Event) => {
        if (e.target instanceof HTMLElement && e.target.dataset.link === ROUTE.NOT_FOUND) {
            this.app?.setCurrentPage(ROUTE.MAIN);
        }
    };

    private onFirstLoad = (): void => {
        const currentLocation: string = window.location.pathname.slice(1) ? window.location.pathname.slice(1) : 'main';
        this.app?.setCurrentPage(currentLocation);
        window.removeEventListener('load', this.onFirstLoad);
    };

    private redirectCallBack = (e: PopStateEvent): void => {
        const currentPath: string = window.location.pathname.slice(1);
        this.app?.setCurrentPage(currentPath, e.state.page === currentPath);
    };

    private onRegistrationSubmit = (e: Event): void => {
        const target: EventTarget | null = e.target;
        if (target instanceof HTMLFormElement) {
            e.preventDefault();
            const fields: NodeListOf<HTMLInputElement> = target.querySelectorAll('.form-item input');
            const fieldNames: string[] = [
                'email',
                'password',
                'firstName',
                'lastName',
                'dateOfBirth',
                'country',
                'city',
                'streetName',
                'postalCode',
            ];
            const pairs: string[][] = [...fields].map((el: HTMLInputElement, i: number) => [fieldNames[i], el.value]);
            const address = Object.fromEntries(pairs.slice(5));
            const customerData = Object.fromEntries(pairs.slice(0, 5));

            address.country = this.app?.getCodeFromCountryName(address.country);
            customerData.addresses = [address];

            apiCustomer
                .createCustomer(customerData)
                .then((): void => {
                    alert('success');
                })
                .catch((err: Error) => alert(err.message));
        }
    };

    private onLoginSubmit = (e: Event): void => {
        const target: EventTarget | null = e.target;
        if (target instanceof HTMLFormElement) {
            e.preventDefault();
            const fields: NodeListOf<HTMLInputElement> = target.querySelectorAll('.form-item input');
            const fieldNames: string[] = ['email', 'password'];
            const pairs: string[][] = [...fields].map((el: HTMLInputElement, i: number) => [fieldNames[i], el.value]);
            const customerData = Object.fromEntries(pairs);
            apiCustomer
                .signIn(customerData)
                .then((resp: ClientResponse<CustomerSignInResult>) => {
                    const customer: Customer = resp.body.customer;
                    return apiCustomer.createEmailToken({ id: customer.id, ttlMinutes: 2 });
                })
                .then((response: ClientResponse<CustomerToken>): void => {
                    console.log(response);
                    alert('success');
                })
                .catch((err: Error) => alert(err.message));
        }
    };
}
