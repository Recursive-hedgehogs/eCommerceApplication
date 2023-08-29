import App from '../../app/app';
import LoginPage from './login-page';
import { ROUTE } from '../../constants/enums/enum';
import { Router } from '../../router/router';
import { validateEmail, validatePassword } from '../../utils/validations';
import { apiCustomer } from '../../api/api-customer';
import { ClientResponse, Customer, CustomerSignInResult } from '@commercetools/platform-sdk';

export class LoginPageController {
    private app: App;
    private loinPage: LoginPage;
    private router: Router;

    constructor() {
        this.app = new App();
        this.loinPage = this.app.loginPage;
        this.router = new Router();
        this.addListeners();
    }

    private addListeners(): void {
        this.loinPage.element.addEventListener('input', this.onLoginValidate);
        this.loinPage.element.addEventListener('click', this.togglePassword);
        this.loinPage.element.addEventListener('submit', this.onLoginSubmit);
    }

    private onLoginValidate = (e: Event): void => {
        const target: HTMLInputElement = <HTMLInputElement>e.target;
        if (target.id === 'input-login-email') {
            this.app?.loginPage.onEmailValidate(target);
        } else if (target.id === 'input-login-password') {
            this.app?.loginPage.onPasswordValidate(target);
        }
    };

    public togglePassword = (e: Event): void => {
        const target: HTMLInputElement = <HTMLInputElement>e.target;
        if (target.id === 'password-icon') {
            this.app?.loginPage.changePasswordVisibility();
        } else if (target.id === 'password-icon-registr') {
            this.app?.registrationPage.changePasswordVisibility();
        }
        if (e.target instanceof HTMLElement && e.target.dataset.link === ROUTE.REGISTRATION) {
            this.router.navigate(ROUTE.REGISTRATION);
        }
    };

    public onLoginSubmit = (e: SubmitEvent): void => {
        const target: EventTarget | null = e.target;
        if (target instanceof HTMLFormElement) {
            e.preventDefault();
            const inputEmail: NodeListOf<HTMLElement> = target.querySelectorAll('.form-control');
            const fail: NodeListOf<HTMLElement> = target.querySelectorAll('.invalid-feedback');
            const loginBtn: HTMLElement | null = document.getElementById('login-btn');
            const logoutBtn: HTMLElement | null = document.getElementById('logout-btn');
            const profileBtn: HTMLElement | null = document.getElementById('profile-btn');
            const registrBtn: HTMLElement | null = document.getElementById('registration-btn');
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
                    this.router.navigate(ROUTE.MAIN); //add redirection to MAIN page
                    logoutBtn?.classList.remove('hidden');
                    profileBtn?.classList.remove('hidden');
                    loginBtn?.classList.add('hidden');
                    registrBtn?.classList.add('hidden');
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
}
