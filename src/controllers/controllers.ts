import App from '../app/app';
import { ROUTE } from '../models/enums/enum';
import { apiCustomer } from '../api/api-customer';
import { ClientResponse, Customer, CustomerSignInResult, CustomerToken } from '@commercetools/platform-sdk';

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
        const logoLink: HTMLElement | null = document.querySelector('.navbar-brand');
        loginBtn?.addEventListener('click', (): void => {
            if (this.app?.isAuthenticated()) {
                console.log('Redirecting to MAIN page');
                this.app?.setCurrentPage(ROUTE.MAIN); //redirecting to the Main page, if user is authenticated
            } else {
                console.log('Redirecting to LOGIN page');
                this.app?.setCurrentPage(ROUTE.LOGIN); // else to the login page
            }
            this.app?.setCurrentPage(ROUTE.LOGIN);
        });
        registrBtn?.addEventListener('click', (): void => {
            this.app?.setCurrentPage(ROUTE.REGISTRATION);
        });
        logoLink?.addEventListener('click', (e): void => {
            e.preventDefault();
            this.app?.setCurrentPage(ROUTE.MAIN);
        });

        this.app?.view?.pages?.get(ROUTE.MAIN)?.addEventListener('click', this.onMainPageClick);
        this.app?.view?.pages?.get(ROUTE.REGISTRATION)?.addEventListener('submit', this.onRegistrationSubmit);
        this.app?.view?.pages?.get(ROUTE.REGISTRATION)?.addEventListener('change', this.onRegistrationChange);
        this.app?.view?.pages?.get(ROUTE.LOGIN)?.addEventListener('submit', this.onLoginSubmit);
        this.app?.view?.pages?.get(ROUTE.LOGIN)?.addEventListener('input', this.onLoginValidate);
        this.app?.view?.pages?.get(ROUTE.LOGIN)?.addEventListener('click', this.togglePassword);
        this.app?.view?.pages?.get(ROUTE.NOT_FOUND)?.addEventListener('click', this.onNotFoundPageClick);
    }

    private togglePassword = (e: Event): void => {
        const target: HTMLInputElement = <HTMLInputElement>e.target;
        if (target.id === 'password-icon') {
            this.app?.loginPage.changePasswordVisibility();
        }
    };

    private onLoginValidate = (e: Event): void => {
        const target: HTMLInputElement = <HTMLInputElement>e.target;
        if (target.id === 'input-login-email') {
            this.app?.loginPage.onEmailValidate(target);
        } else if (target.id === 'input-login-password') {
            this.app?.loginPage.onPasswordValidate(target);
        }
    };

    private onMainPageClick = (e: Event): void => {
        e.preventDefault();
        const target: EventTarget | null = e.target;
        if (target instanceof HTMLElement) {
            switch (target.dataset.link) {
                case ROUTE.LOGIN:
                    this.app?.setCurrentPage(ROUTE.LOGIN);
                    document.title = 'eCommerceApplication/Login';
                    break;
                case ROUTE.REGISTRATION:
                    this.app?.setCurrentPage(ROUTE.REGISTRATION);
                    document.title = 'eCommerceApplication/Registration';
                    break;
                case ROUTE.CATALOG:
                    this.app?.setCurrentPage(ROUTE.CATALOG);
                    document.title = 'eCommerceApplication/Catalog';
                    break;
                case ROUTE.PRODUCT:
                    this.app?.setCurrentPage(ROUTE.PRODUCT);
                    document.title = 'eCommerceApplication/Product';
                    break;
                case ROUTE.USER:
                    this.app?.setCurrentPage(ROUTE.USER);
                    document.title = 'eCommerceApplication/User';
                    break;
                case ROUTE.BASKET:
                    this.app?.setCurrentPage(ROUTE.BASKET);
                    document.title = 'eCommerceApplication/Basket';
                    break;
                case ROUTE.ABOUT:
                    this.app?.setCurrentPage(ROUTE.ABOUT);
                    document.title = 'eCommerceApplication/About';
                    break;
                default:
                    break;
            }
        }
    };

    private onNotFoundPageClick = (e: Event): void => {
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
        if (e.state && e.state.page) {
            this.app?.setCurrentPage(currentPath, e.state.page === currentPath);
        }
    };

    private onRegistrationSubmit = (e: SubmitEvent): void => {
        const target: EventTarget | null = e.target;
        if (target instanceof HTMLFormElement) {
            e.preventDefault();
            const inputEmail: Element | null = target.querySelector('.email input');
            // const defaultSwitcher: NodeListOf<HTMLInputElement> = target.querySelectorAll('.default-address');
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

            console.log(customerData);

            apiCustomer
                .createCustomer(customerData)
                .then((): void => {
                    this.onLoginSubmit(e); //call auto-login after registration
                })
                .then((): void => {
                    this.app?.showMessage('Your account has been created');
                    this.app?.setCurrentPage(ROUTE.MAIN); //add redirection to MAIN page
                })
                .catch((err: Error): void => {
                    inputEmail?.classList.add('is-invalid');
                    if (inputEmail?.nextElementSibling) {
                        inputEmail.nextElementSibling.innerHTML =
                            'There is already an existing customer with the provided email.';
                    }
                    alert(err.message);
                });
        }
    };

    private onLoginSubmit = (e: SubmitEvent): void => {
        const target: EventTarget | null = e.target;
        if (target instanceof HTMLFormElement) {
            e.preventDefault();
            const inputEmail: NodeListOf<HTMLElement> = target.querySelectorAll('.form-control');
            const fail: NodeListOf<HTMLElement> = target.querySelectorAll('.invalid-feedback');

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
                    this.app?.showMessage('You are logged in');
                    this.app?.setAuthenticationStatus(true); // set authentication state
                    this.app?.setCurrentPage(ROUTE.MAIN); //add redirection to MAIN page
                })
                .catch((): void => {
                    inputEmail?.forEach((el: Element): void => {
                        el.classList.add('is-invalid');
                    });
                    fail?.forEach((el: HTMLElement): void => {
                        el.innerText = 'Incorrect email or password - please try again.';
                        el.style.display = 'block';
                    });
                });
        }
    };

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
            // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

            if (billingContainer) {
                shippingContainer?.classList.contains('hidden')
                    ? (billingContainer.style.width = '100%')
                    : (billingContainer.style.width = '50%');
            }
        }
    };
}
