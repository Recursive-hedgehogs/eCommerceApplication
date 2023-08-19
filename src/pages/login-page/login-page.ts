import ElementCreator from '../../utils/template-creation';
import template from './login-page.template.html';
import './login-page.scss';
import * as validationUtils from '../../utils/validations';
export default class LoginPage {
    element: HTMLElement;

    constructor() {
        this.element = new ElementCreator({
            tag: 'div',
            classNames: ['login-page-container'],
            innerHTML: template,
        }).getElement();
    }

    public getElement(): HTMLElement {
        return this.element;
    }

    public changePasswordVisibility(): void {
        const passwordInput: HTMLInputElement = <HTMLInputElement>document.getElementById('input-login-password');
        const passwordIcon: HTMLElement = <HTMLElement>document.getElementById('password-icon');
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

    public onEmailValidate = (emailInput: HTMLInputElement): void => {
        const parentDiv = emailInput.closest('.form-item');
        if (!parentDiv) return;
        const inputError: HTMLElement = <HTMLElement>parentDiv.querySelector('.invalid-feedback');
        const errorMessage = validationUtils.validateEmail(emailInput.value);
        if (inputError) {
            emailInput.classList.add('is-invalid');
            inputError.textContent = errorMessage;
            if (!errorMessage) {
                emailInput.classList.remove('is-invalid');
            }
        } else if (errorMessage) {
            const newErrorDiv = document.createElement('div');
            newErrorDiv.classList.add('invalid-feedback');
            newErrorDiv.textContent = errorMessage;
            parentDiv.append(newErrorDiv);
        }
    };

    public onPasswordValidate = (passwordInput: HTMLInputElement): void => {
        const parentDiv = passwordInput.closest('.form-item');
        const passwordIcon: HTMLElement = <HTMLElement>document.getElementById('password-icon');
        if (!parentDiv) return;
        const inputError: HTMLElement = <HTMLElement>parentDiv.querySelector('.invalid-feedback');
        const errorMessage = validationUtils.validatePassword(passwordInput.value);
        if (inputError) {
            passwordInput.classList.add('is-invalid');
            inputError.textContent = errorMessage;
            passwordIcon.style.display = errorMessage ? 'none' : 'inline-block';
            if (!errorMessage) {
                passwordInput.classList.remove('is-invalid');
            }
        } else if (errorMessage) {
            const newErrorDiv = document.createElement('div');
            newErrorDiv.classList.add('invalid-feedback');
            newErrorDiv.textContent = errorMessage;
            parentDiv.append(newErrorDiv);
            passwordIcon.style.display = 'none';
        }
    };
}
