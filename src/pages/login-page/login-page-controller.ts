import App from '../../app/app';
import LoginPage from './login-page';
export class LoginPageController {
    private app: App;
    private loginPage: LoginPage;

    constructor() {
        this.app = new App();
        this.loginPage = this.app.loginPage;
        this.addListeners();
    }

    private addListeners(): void {
        this.loginPage.element.addEventListener('input', this.onLoginValidate);
        this.loginPage.element.addEventListener('click', this.togglePassword);
        this.loginPage.element.addEventListener('submit', this.app.onLogin);
    }

    private onLoginValidate = (e: Event): void => {
        const target: HTMLInputElement = <HTMLInputElement>e.target;
        if (target.id === 'input-login-email') {
            this.app?.loginPage.onEmailValidate(target);
        } else if (target.id === 'input-login-password') {
            this.app?.loginPage.onPasswordValidate(target);
        }
    };

    private togglePassword = (e: Event): void => {
        const target: HTMLInputElement = <HTMLInputElement>e.target;
        if (target.id === 'password-icon') {
            const passwordInput: HTMLInputElement = <HTMLInputElement>document.querySelector('#input-login-password');
            this.app?.changePasswordVisibility(passwordInput, target);
        }
    };
}
