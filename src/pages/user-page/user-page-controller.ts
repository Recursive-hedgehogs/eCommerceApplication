import App from '../../app/app';
import { Router } from '../../router/router';
import UserPage from './user-page';
import {
    validateDateOfBirth,
    validateEmail,
    validateName,
    validatePassword,
    validatePostalCode,
} from '../../utils/validations';
import { apiCustomer } from '../../api/api-customer';
import { ClientResponse, Customer, CustomerSignInResult } from '@commercetools/platform-sdk';
import { ROUTE } from '../../constants/enums/enum';

export class UserPageController {
    private app: App;
    private userPage: UserPage;
    private router: Router;

    constructor() {
        this.app = new App();
        this.userPage = this.app.userPage;
        this.router = new Router();
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
        // this.userPage.element.addEventListener('submit', this.onEditSubmit);
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
        // const inputEmail: Element | null = target.querySelector('.email input');
        const personalFields: NodeListOf<HTMLInputElement> = this.userPage.element.querySelectorAll('.personal');
        console.log(personalFields);
        const namesFields: string[] = ['firstName', 'lastName', 'dateOfBirth', 'email'];
        const personalArray: string[][] = [...personalFields].map((el: HTMLInputElement, i: number) => [
            namesFields[i],
            el.value,
        ]);
        const customerData = Object.fromEntries(personalArray);
        console.log(customerData);
        if (
            validateEmail(customerData.email) ||
            validateName(customerData.firstName) ||
            validateName(customerData.lastName) ||
            validateDateOfBirth(customerData.dateOfBirth)
        ) {
            return;
        }
        // apiCustomer
        //     .signIn(customerData)
        //     .then((resp: ClientResponse<CustomerSignInResult>) => {
        //         const customer: Customer = resp.body.customer;
        //         this.app?.userPage.showUserData(customer.id);
        //         return apiCustomer.createEmailToken({ id: customer.id, ttlMinutes: 2 });
        //     })
        //     .then((): void => {
        //         this.app?.showMessage('You are logged in');
        //         this.app?.setAuthenticationStatus(true); // set authentication state
        //         this.router.navigate(ROUTE.MAIN); //add redirection to MAIN page
        //     })
        //     .catch((err: Error): void => {
        //         console.log(err);
        //         // inputEmail?.forEach((el: Element): void => {
        //         //     el.classList.add('is-invalid');
        //         // });
        //         // fail?.forEach((el: HTMLElement): void => {
        //         //     el.innerText = 'Incorrect email or password - please try again.';
        //         // });
        //     });
    };
}
