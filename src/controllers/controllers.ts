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
        loginBtn?.addEventListener('click', (): void => {
            this.app?.setCurrentPage(ROUTE.LOGIN);
        });
        registrBtn?.addEventListener('click', (): void => {
            this.app?.setCurrentPage(ROUTE.REGISTRATION);
        });

        this.app?.view?.pages?.get(ROUTE.MAIN)?.addEventListener('click', this.onMainPageClick);
        this.app?.view?.pages?.get(ROUTE.REGISTRATION)?.addEventListener('submit', this.onRegistrationSubmit);
        this.app?.view?.pages?.get(ROUTE.LOGIN)?.addEventListener('submit', this.onLoginSubmit);
        this.app?.view?.pages?.get(ROUTE.NOT_FOUND)?.addEventListener('click', this.onNotFoundPageClick);
    }

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

    private onLoginSubmit = (e: SubmitEvent): void => {
        const target: EventTarget | null = e.target;
        if (target instanceof HTMLFormElement) {
            e.preventDefault();
            console.log(target.querySelector('.form-control'));
            const inputEmail = target.querySelector('.form-control');

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
                })
                .catch(() => {
                    inputEmail?.classList.add('is-invalid');
                    if (inputEmail?.nextElementSibling instanceof HTMLElement) {
                        inputEmail.nextElementSibling.innerText = 'Account with the given credentials not found';
                    }
                });
        }
    };
}
