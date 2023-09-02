import App from '../../app/app';
import { Router } from '../../router/router';
import UserPage from './user-page';

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
        // this.userPage.element.addEventListener('input', this.onEditValidate);
        editMainBtn?.addEventListener('click', this.openEditMode);
        cancelMainBtn?.addEventListener('click', this.closeEditMode);
        // this.userPage.element.addEventListener('submit', this.onEditSubmit);
    }

    private openEditMode = (e: Event): void => {
        this.app?.userPage.openMaintoEdit();
    };

    private closeEditMode = (e: Event): void => {
        this.app?.userPage.closeMaintoEdit();
    };

}
