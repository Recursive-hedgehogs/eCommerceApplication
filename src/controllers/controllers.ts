import App from '../app/app';
import { ROUTE } from '../models/enums/enum';
import { apiCustomer } from '../api/api-customer';
import { ClientResponse, Customer, CustomerSignInResult } from '@commercetools/platform-sdk';
import {
    validateDateOfBirth,
    validateEmail,
    validateName,
    validatePassword,
    validatePostalCode,
} from '../utils/validations';
import { ApiRefreshTokenFlow } from '../api/api-refresh-token-flow';
import SdkAuth from '@commercetools/sdk-auth';
import { environment } from '../environment/environment';
import { ApiExistingTokenFlow } from '../api/api-existing-token-flow';
import { ITokenResponse } from '../models/interfaces/response.interface';
import { ApiProduct } from '../api/products/api-products';

export class Controllers {
    private app: App | null;
    private apiRefreshTokenFlow: ApiRefreshTokenFlow;
    private apiExistingTokenFlow: ApiExistingTokenFlow;
    private apiProduct: ApiProduct;

    constructor() {
        this.app = null;
        this.apiRefreshTokenFlow = new ApiRefreshTokenFlow();
        this.apiExistingTokenFlow = new ApiExistingTokenFlow();
        this.apiProduct = new ApiProduct();
    }

    public start(app: App): void {
        this.app = app;
        this.addListeners();
    }

    public addListeners(): void {
        window.addEventListener('load', this.onFirstLoad);
        window.addEventListener('popstate', this.redirectCallBack);

        const loginBtn: HTMLElement | null = document.getElementById('login-btn');
        const logoutBtn: HTMLElement | null = document.getElementById('logout-btn');
        const registrBtn: HTMLElement | null = document.getElementById('registration-btn');
        const logoLink: HTMLElement | null = document.querySelector('.navbar-brand');
        loginBtn?.addEventListener('click', (): void => {
            if (this.app?.isAuthenticated()) {
                this.app?.setCurrentPage(ROUTE.MAIN); //redirecting to the Main page, if user is authenticated
            } else {
                this.app?.setCurrentPage(ROUTE.LOGIN); // else to the login page
            }
            this.app?.setCurrentPage(ROUTE.LOGIN);
        });
        logoutBtn?.addEventListener('click', (): void => {
            this.app?.setAuthenticationStatus(false); // set authentication state
            this.app?.setCurrentPage(ROUTE.LOGIN); // else to the login page
            logoutBtn.classList.add('hidden');
            loginBtn?.classList.remove('hidden');
            localStorage.removeItem('refreshToken');
        });
        registrBtn?.addEventListener('click', (): void => {
            this.app?.setCurrentPage(ROUTE.REGISTRATION);
        });
        logoLink?.addEventListener('click', (e: MouseEvent): void => {
            e.preventDefault();
            this.app?.setCurrentPage(ROUTE.MAIN);
        });

        this.app?.view?.pages?.get(ROUTE.MAIN)?.addEventListener('click', this.onMainPageClick);
        this.app?.view?.pages?.get(ROUTE.REGISTRATION)?.addEventListener('submit', this.onRegistrationSubmit);
        this.app?.view?.pages?.get(ROUTE.REGISTRATION)?.addEventListener('change', this.onRegistrationChange);
        this.app?.view?.pages?.get(ROUTE.REGISTRATION)?.addEventListener('input', this.onRegistrationValidate);
        this.app?.view?.pages?.get(ROUTE.REGISTRATION)?.addEventListener('click', this.onRegistrationClick);
        this.app?.view?.pages?.get(ROUTE.REGISTRATION)?.addEventListener('click', this.togglePassword);
        this.app?.view?.pages?.get(ROUTE.LOGIN)?.addEventListener('submit', this.onLoginSubmit);
        this.app?.view?.pages?.get(ROUTE.LOGIN)?.addEventListener('input', this.onLoginValidate);
        this.app?.view?.pages?.get(ROUTE.LOGIN)?.addEventListener('click', this.togglePassword);
        this.app?.view?.pages?.get(ROUTE.NOT_FOUND)?.addEventListener('click', this.onNotFoundPageClick);
        this.app?.view?.pages?.get(ROUTE.CATALOG)?.addEventListener('click', this.onCatalogClick);
    }

    private onCatalogClick = (e: Event): void => {
        if (e.target) {
            console.log('hhfjhfhjfhjf');
            this.apiProduct.getProductByKey('denim_jacket')?.then((resp) => {
                console.log(resp);
                this.app?.productPage.setContent(resp.body);
                this.app?.setCurrentPage(ROUTE.PRODUCT);
            });
        }
    };

    private togglePassword = (e: Event): void => {
        const target: HTMLInputElement = <HTMLInputElement>e.target;
        if (target.id === 'password-icon') {
            this.app?.loginPage.changePasswordVisibility();
        } else if (target.id === 'password-icon-registr') {
            this.app?.registrationPage.changePasswordVisibility();
        }
        if (e.target instanceof HTMLElement && e.target.dataset.link === ROUTE.REGISTRATION) {
            this.app?.setCurrentPage(ROUTE.REGISTRATION);
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

    private onMainPageClick = (e: Event): void => {
        e.preventDefault();
        const target: EventTarget | null = e.target;
        if (target instanceof HTMLElement) {
            switch (target.dataset.link) {
                case ROUTE.LOGIN:
                    this.app?.setCurrentPage(ROUTE.LOGIN);
                    document.title = 'storiesShelf store | Login';
                    break;
                case ROUTE.REGISTRATION:
                    this.app?.setCurrentPage(ROUTE.REGISTRATION);
                    document.title = 'storiesShelf store | Registration';
                    break;
                case ROUTE.CATALOG:
                    this.app?.setCurrentPage(ROUTE.CATALOG);
                    document.title = 'storiesShelf store | Catalog';
                    break;
                case ROUTE.PRODUCT:
                    this.app?.setCurrentPage(ROUTE.PRODUCT);
                    document.title = 'storiesShelf store | Product';
                    break;
                case ROUTE.USER:
                    this.app?.setCurrentPage(ROUTE.USER);
                    document.title = 'storiesShelf store | User';
                    break;
                case ROUTE.BASKET:
                    this.app?.setCurrentPage(ROUTE.BASKET);
                    document.title = 'storiesShelf store | Basket';
                    break;
                case ROUTE.ABOUT:
                    this.app?.setCurrentPage(ROUTE.ABOUT);
                    document.title = 'shelfStories store | About';
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
        const refreshToken: string | null = localStorage.getItem('refreshToken');
        if (refreshToken) {
            const authClient = new SdkAuth({
                host: environment.authURL,
                projectKey: environment.projectKey,
                disableRefreshToken: false,
                credentials: {
                    clientId: environment.clientID,
                    clientSecret: environment.clientSecret,
                },
                scopes: [environment.scope],
                fetch,
            });
            authClient.refreshTokenFlow(refreshToken).then((resp: ITokenResponse): void => {
                this.apiExistingTokenFlow.setUserData(resp.access_token);
                // this.app?.showMessage('You are logged in');
                this.app?.setAuthenticationStatus(true); // set authentication state
                if (window.location.pathname.slice(1) === ROUTE.LOGIN) {
                    this.app?.setCurrentPage(ROUTE.MAIN); //add redirection from login to MAIN page
                }
                const loginBtn: HTMLElement | null = document.getElementById('login-btn');
                const logoutBtn: HTMLElement | null = document.getElementById('logout-btn');
                logoutBtn?.classList.remove('hidden');
                loginBtn?.classList.add('hidden');
            });
            this.apiRefreshTokenFlow.setUserData(refreshToken);
            // this.apiRefreshTokenFlow.apiRoot
            //     ?.get()
            //     .execute()
            // .then((resp: ClientResponse<Project>): void => {
            // if (resp.headers) {
            //     const headers: { Authorization: string } = resp.headers as { Authorization: string };
            //     this.apiExistingTokenFlow.setUserData(headers.Authorization);
            //     this.app?.showMessage('You are logged in');
            //     this.app?.setAuthenticationStatus(true); // set authentication state
            //     this.app?.setCurrentPage(ROUTE.MAIN); //add redirection to MAIN page
            //     const loginBtn: HTMLElement | null = document.getElementById('login-btn');
            //     const logoutBtn: HTMLElement | null = document.getElementById('logout-btn');
            //     logoutBtn?.classList.remove('hidden');
            //     loginBtn?.classList.add('hidden');
            // }
            // })
            // .catch((err) => {
            //     throw Error(err);
            // });
        }
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
                    this.onLoginSubmit(e); //call auto-login after registration
                })
                .then((): void => {
                    this.app?.showMessage('Your account has been created');
                    this.app?.setCurrentPage(ROUTE.MAIN); //add redirection to MAIN page
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

    private onLoginSubmit = (e: SubmitEvent): void => {
        const target: EventTarget | null = e.target;
        if (target instanceof HTMLFormElement) {
            e.preventDefault();
            const inputEmail: NodeListOf<HTMLElement> = target.querySelectorAll('.form-control');
            const fail: NodeListOf<HTMLElement> = target.querySelectorAll('.invalid-feedback');
            const loginBtn: HTMLElement | null = document.getElementById('login-btn');
            const logoutBtn: HTMLElement | null = document.getElementById('logout-btn');
            const fields: NodeListOf<HTMLInputElement> = target.querySelectorAll('.form-item input');
            const fieldNames: string[] = ['email', 'password'];
            const pairs: string[][] = [...fields].map((el: HTMLInputElement, i: number) => [fieldNames[i], el.value]);
            const customerData = Object.fromEntries(pairs);
            if (validateEmail(customerData.email) || validatePassword(customerData.password)) {
                return;
            }
            apiCustomer
                .signIn(customerData)
                .then((resp: ClientResponse<CustomerSignInResult>) => {
                    const customer: Customer = resp.body.customer;
                    return apiCustomer.createEmailToken({ id: customer.id, ttlMinutes: 2 });
                })
                .then((): void => {
                    this.app?.showMessage('You are logged in');
                    this.app?.setAuthenticationStatus(true); // set authentication state
                    this.app?.setCurrentPage(ROUTE.MAIN); //add redirection to MAIN page
                    logoutBtn?.classList.remove('hidden');
                    loginBtn?.classList.add('hidden');
                })
                .catch((): void => {
                    inputEmail?.forEach((el: Element): void => {
                        el.classList.add('is-invalid');
                    });
                    fail?.forEach((el: HTMLElement): void => {
                        el.innerText = 'Incorrect email or password - please try again.';
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

    private checkCountry(target: HTMLInputElement, country: HTMLSelectElement): void {
        target.addEventListener('keypress', (event) => {
            if (country.value === 'Poland') {
                this.app?.registrationPage.formatPostalCode(event, target, '-', 6);
            } else if (country.value === 'Germany') {
                this.app?.registrationPage.formatPostalCode(event, target, '', 5);
            }
        });
    }

    private onRegistrationClick = (e: Event): void => {
        if (e.target instanceof HTMLElement && e.target.dataset.link === ROUTE.LOGIN) {
            this.app?.setCurrentPage(ROUTE.LOGIN);
        }
    };
}
