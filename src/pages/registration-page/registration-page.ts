import ElementCreator from '../../utils/template-creation';
import template from './registration-page.html';
import * as validationUtils from '../../utils/validations';
import './registration-page.scss';

export default class RegistrationPage {
    element: HTMLElement;

    constructor() {
        this.element = new ElementCreator({
            tag: 'section',
            classNames: ['registration-page-container'],
            innerHTML: template,
        }).getElement();
    }

    public getElement(): HTMLElement {
        return this.element;
    }

    public onNameValidate = (nameInput: HTMLInputElement): void => {
        const errorMessage: string | null = validationUtils.validateName(nameInput.value);
        this.onError(errorMessage, nameInput);
    };

    public onStreetValidate = (nameInput: HTMLInputElement): void => {
        const errorMessage: string | null = validationUtils.validateStreet(nameInput.value);
        this.onError(errorMessage, nameInput);
    };

    public onDateDateOfBirth = (nameInput: HTMLInputElement): void => {
        const errorMessage: string | null = validationUtils.validateDateOfBirth(nameInput.value);
        this.onError(errorMessage, nameInput);
    };

    public onPostalValidate = (codeInput: HTMLInputElement): void => {
        const parentDiv: Element | null = codeInput.closest('.form-item');
        if (!parentDiv) return;
        const inputError: HTMLElement = <HTMLElement>parentDiv.querySelector('.invalid-feedback');
        const errorMessage: string | null = validationUtils.validatePostalCode(codeInput.value);
        if (errorMessage) {
            codeInput.classList.add('is-invalid');
        }
        if (inputError) {
            codeInput.classList.add('is-invalid');
            inputError.textContent = errorMessage;
            if (!errorMessage) {
                codeInput.classList.remove('is-invalid');
            }
        } else {
            const newErrorDiv: HTMLDivElement = document.createElement('div');
            newErrorDiv.classList.add('invalid-feedback');
            newErrorDiv.textContent = errorMessage;
            parentDiv.append(newErrorDiv);
        }
    };

    public formatPostalCode = (event: Event, target: HTMLInputElement, separator: string, maxLength: number) => {
        const numValue: string = target.value;
        if (numValue.length >= maxLength) {
            event.preventDefault();
            target.value = numValue.substring(0, maxLength);
        }
        if (separator && numValue.length >= 2 && numValue.charAt(2) !== separator) {
            target.value = `${numValue.substring(0, 2)}${separator}${numValue.substring(2)}`;
        }
    };

    private onError(errorMessage: string | null, nameInput: HTMLInputElement) {
        const parentDiv: Element | null = nameInput.closest('.form-item');
        if (!parentDiv) return;
        const inputError: HTMLElement = <HTMLElement>parentDiv.querySelector('.invalid-feedback');
        if (errorMessage) {
            nameInput.classList.add('is-invalid');
        }
        if (inputError) {
            nameInput.classList.add('is-invalid');
            inputError.textContent = errorMessage;
            if (!errorMessage) {
                nameInput.classList.remove('is-invalid');
            }
        } else {
            const newErrorDiv: HTMLDivElement = document.createElement('div');
            newErrorDiv.classList.add('invalid-feedback');
            newErrorDiv.textContent = errorMessage;
            parentDiv.append(newErrorDiv);
        }
    }
}
