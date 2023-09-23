import ElementCreator from '../../utils/template-creation';
import template from './login-page.template.html';
import './login-page.scss';
import * as validationUtils from '../../utils/validations';
export default class LoginPage {
    public element: HTMLElement;

    constructor() {
        this.element = new ElementCreator({
            tag: 'section',
            classNames: ['login-page-container'],
            innerHTML: template,
        }).getElement();
    }

    public getElement(): HTMLElement {
        return this.element;
    }

    public onEmailValidate = (emailInput: HTMLInputElement): void => {
        const parentDiv: Element | null = emailInput.closest('.form-item');
        if (!parentDiv) return;
        const inputError: HTMLElement = <HTMLElement>parentDiv.querySelector('.invalid-feedback');
        const errorMessage: string | null = validationUtils.validateEmail(emailInput.value);
        if (inputError) {
            emailInput.classList.add('is-invalid');
            inputError.textContent = errorMessage;
            if (!errorMessage) {
                emailInput.classList.remove('is-invalid');
            }
        } else if (errorMessage) {
            const newErrorDiv: HTMLDivElement = document.createElement('div');
            newErrorDiv.classList.add('invalid-feedback');
            newErrorDiv.textContent = errorMessage;
            parentDiv.append(newErrorDiv);
        }
        if (emailInput.validity.valid) {
            emailInput.classList.remove('is-invalid');
        }
        const password: Element | null = this.element.querySelector('.password');
        const passwordInput: HTMLElement | null = document.getElementById('input-login-password');
        if (passwordInput instanceof HTMLInputElement && passwordInput.validity.valid) {
            passwordInput.classList.remove('is-invalid');
            password?.querySelector('.invalid-feedback')?.classList.remove('invalid-feedback');
        }
    };

    public onPasswordValidate = (passwordInput: HTMLInputElement): void => {
        const parentDiv: Element | null = passwordInput.closest('.form-item');
        if (!parentDiv) return;
        const inputError: HTMLElement = <HTMLElement>parentDiv.querySelector('.invalid-feedback');
        const errorMessage: string | null = validationUtils.validatePassword(passwordInput.value);
        if (inputError) {
            passwordInput.classList.add('is-invalid');
            inputError.textContent = errorMessage;
            if (!errorMessage) {
                passwordInput.classList.remove('is-invalid');
            }
        } else if (errorMessage) {
            const newErrorDiv: HTMLDivElement = document.createElement('div');
            newErrorDiv.classList.add('invalid-feedback');
            newErrorDiv.textContent = errorMessage;
            parentDiv.append(newErrorDiv);
        }
        const email: Element | null = this.element.querySelector('.email');
        const emailInput: HTMLElement | null = document.getElementById('input-login-email');
        if (emailInput instanceof HTMLInputElement && emailInput.validity.valid) {
            emailInput.classList.remove('is-invalid');
            email?.querySelector('.invalid-feedback')?.classList.remove('invalid-feedback');
        }
    };
}
