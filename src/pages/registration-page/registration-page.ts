import ElementCreator from '../../utils/template-creation';
import template from './registration-page.html';
import * as validationUtils from '../../utils/validations';
import './registration-page.scss';
export default class RegistrationPage {
    element: HTMLElement;

    constructor() {
        this.element = new ElementCreator({
            tag: 'div',
            classNames: ['registration-page-container'],
            innerHTML: template,
        }).getElement();
    }

    public getElement(): HTMLElement {
        return this.element;
    }

    public onNameValidate = (nameInput: HTMLInputElement): void => {
        const parentDiv = nameInput.closest('.form-item');
        if (!parentDiv) return;
        const inputError: HTMLElement = <HTMLElement>parentDiv.querySelector('.invalid-feedback');
        const errorMessage = validationUtils.validateName(nameInput.value);
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
            const newErrorDiv = document.createElement('div');
            newErrorDiv.classList.add('invalid-feedback');
            newErrorDiv.textContent = errorMessage;
            parentDiv.append(newErrorDiv);
        }
    };

    public onDateDateOfBirth = (nameInput: HTMLInputElement): void => {
        const parentDiv = nameInput.closest('.form-item');
        if (!parentDiv) return;
        const inputError: HTMLElement = <HTMLElement>parentDiv.querySelector('.invalid-feedback');
        const errorMessage = validationUtils.validateDateOfBirth(nameInput.value);
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
            const newErrorDiv = document.createElement('div');
            newErrorDiv.classList.add('invalid-feedback');
            newErrorDiv.textContent = errorMessage;
            parentDiv.append(newErrorDiv);
        }
    };
}
