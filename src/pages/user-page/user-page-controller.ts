import App from '../../app/app';
import UserPage from './user-page';
import { validateDateOfBirth, validateEmail, validateName } from '../../utils/validations';
import { apiCustomer } from '../../api/api-customer';
import { CustomerUpdate } from '@commercetools/platform-sdk';

export class UserPageController {
    private app: App;
    private userPage: UserPage;

    constructor() {
        this.app = new App();
        this.userPage = this.app.userPage;
        this.addListeners();
    }

    private addListeners(): void {
        const editMainBtn = this.userPage.element.querySelector('#btn-edit-main');
        const cancelMainBtn = this.userPage.element.querySelector('#btn-cancel-main');
        const saveMainBtn = this.userPage.element.querySelector('#btn-save-main');
        this.userPage.element.addEventListener('input', this.onEditValidate);
        editMainBtn?.addEventListener('click', this.openMaintoEdit);
        cancelMainBtn?.addEventListener('click', this.closeMaintoEdit);
        saveMainBtn?.addEventListener('click', this.saveUpdatedMain);
    }

    private openMaintoEdit = (): void => {
        this.app?.userPage.openMaintoEdit();
    };

    private closeMaintoEdit = (): void => {
        this.app?.userPage.closeMaintoEdit();
        const invalidInputs: NodeListOf<HTMLElement> = this.userPage.element.querySelectorAll('.is-invalid');
        const invalidFeedbacks: NodeListOf<HTMLElement> = this.userPage.element.querySelectorAll('.invalid-feedback');
        [...invalidInputs].forEach((el) => {
            el.classList.remove('is-invalid');
        });
        [...invalidFeedbacks].forEach((el) => {
            if (el.parentElement) el.parentElement.removeChild(el);
        });
    };

    private onEditValidate = (e: Event): void => {
        const target: HTMLInputElement = <HTMLInputElement>e.target;
        switch (target.id) {
            case 'user-email':
                this.app?.loginPage.onEmailValidate(target);
                break;
            case 'user-first-name':
            case 'user-last-name':
                this.app?.registrationPage.onNameValidate(target);
                break;
            case 'user-date-of-birth':
                this.app?.registrationPage.onDateDateOfBirth(target);
                break;
            default:
                break;
        }
    };

    private saveUpdatedMain = (): void => {
        const personalFields: NodeListOf<HTMLInputElement> = this.userPage.element.querySelectorAll('.personal');
        const namesFields: string[] = ['firstName', 'lastName', 'dateOfBirth', 'email'];
        const personalArray: string[][] = [...personalFields].map((el: HTMLInputElement, i: number) => [
            namesFields[i],
            el.value,
        ]);
        const customerData = Object.fromEntries(personalArray);
        if (
            validateEmail(customerData.email) ||
            validateName(customerData.firstName) ||
            validateName(customerData.lastName) ||
            validateDateOfBirth(customerData.dateOfBirth)
        ) {
            return;
        }
        const userID: string = <string>this.app.userPage.userData?.id;
        const userVersion: number = <number>this.app.userPage.userData?.version;
        const data: CustomerUpdate = {
            version: userVersion,
            actions: [
                {
                    action: 'setFirstName',
                    firstName: customerData.firstName,
                },
                {
                    action: 'setLastName',
                    lastName: customerData.lastName,
                },
                {
                    action: 'setDateOfBirth',
                    dateOfBirth: customerData.dateOfBirth,
                },
                {
                    action: 'changeEmail',
                    email: customerData.email,
                },
            ],
        };
        apiCustomer
            .updateUser(data, userID)
            ?.then((res): void => {
                this.app?.showMessage('You have successfully changed your personal data');
                this.app.userPage.userData = res.body;
            })
            .then((): void => {
                this.closeMaintoEdit();
            })
            .catch((): void => {
                customerData.email?.classList.add('is-invalid');
                if (customerData.email?.nextElementSibling) {
                    customerData.email.nextElementSibling.innerHTML =
                        'There is already an existing customer with the provided email.';
                }
                this.app?.showMessage('Something went wrong during the edit process, try again later', 'red');
            });
    };
}
