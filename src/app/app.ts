import { IApp } from '../constants/interfaces/interface';
import View from '../view/view';
import { iso31661, ISO31661AssignedEntry } from 'iso-3166';
import { Main } from '../components/main/main';
import LoginPage from '../pages/login-page/login-page';
import RegistrationPage from '../pages/registration-page/registration-page';
import ProductPage from '../pages/product-page/product-page';
import CatalogPage from '../pages/catalog-page/catalog-page';
import MainPage from '../pages/main-page/main-page';
import NotFoundPage from '../pages/not-found-page/not-found-page';
import UserPage from '../pages/user-page/user-page';
import Header from '../components/header/header';
import BasketPage from '../pages/basket-page/basket-page';
import { State } from '../state/state';
import { validateEmail, validatePassword } from '../utils/validations';
import { apiCustomer } from '../api/api-customer';
import { ClientResponse, Customer, CustomerSignInResult } from '@commercetools/platform-sdk';
import { ROUTE } from '../constants/enums/enum';
import { Router } from '../router/router';

class App implements IApp {
    public main: Main = new Main();
    public view!: View | null;
    public productPage!: ProductPage;
    public catalogPage!: CatalogPage;
    public loginPage!: LoginPage;
    public registrationPage!: RegistrationPage;
    public mainPage!: MainPage;
    public userPage!: UserPage;
    public notFoundPage!: NotFoundPage;
    public header!: Header;
    public basketPage!: BasketPage;
    private state: State = new State();
    private countriesArray!: Array<ISO31661AssignedEntry>;
    private loggedIn = false;
    private static singleton: App;
    private router!: Router;

    constructor() {
        if (App.singleton) {
            return App.singleton;
        }
        this.view = null;
        this.main = new Main();
        this.header = new Header();
        this.countriesArray = iso31661;
        this.mainPage = new MainPage();
        this.userPage = new UserPage();
        this.loginPage = new LoginPage();
        this.registrationPage = new RegistrationPage();
        this.productPage = new ProductPage();
        this.catalogPage = new CatalogPage();
        this.notFoundPage = new NotFoundPage();
        this.basketPage = new BasketPage();
        this.router = new Router();
        App.singleton = this;
    }

    public start(view: View): void {
        this.view = view;
    }

    public getCountryFromCode(code: string): string {
        return this.countriesArray.find((el: ISO31661AssignedEntry): boolean => el.alpha2 === code)?.name ?? '';
    }

    public getCodeFromCountryName(name: string): string {
        return this.countriesArray.find((el: ISO31661AssignedEntry): boolean => el.name === name)?.alpha2 ?? '';
    }

    public showMessage(text: string, color?: string): void {
        this.view?.showMessage(text, color);
    }

    public setAuthenticationStatus(status: boolean): void {
        this.loggedIn = status;
        this.state.isLogIn = status;
    }

    public isAuthenticated(): boolean {
        return this.loggedIn;
    }

    public changePasswordVisibility(passwordInput: HTMLInputElement, passwordIcon: HTMLElement): void {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            passwordIcon.classList.remove('fa-eye-slash');
            passwordIcon.classList.add('fa-eye');
        } else {
            passwordInput.type = 'password';
            passwordIcon.classList.remove('fa-eye');
            passwordIcon.classList.add('fa-eye-slash');
        }
    }
    public onLogin = (e: SubmitEvent): void => {
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
                    this.userPage.setUserData(customer.id);
                    return apiCustomer.createEmailToken({ id: customer.id, ttlMinutes: 2 });
                })
                .then((): void => {
                    this.showMessage('You are logged in');
                    this.setAuthenticationStatus(true); // set authentication state
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

export default App;
