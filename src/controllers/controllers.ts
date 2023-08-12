import App from '../app/app';
import { ROUTE } from '../models/enums/enum';

export class Controllers {
    private app: App | null;
    constructor() {
        this.app = null;
    }

    public start(app: App): void {
        this.app = app;
        window.addEventListener('load', () => {
            const currentLocation = window.location.pathname.slice(1) ? window.location.pathname.slice(1) : 'main';
            this.app?.setCurrentPage(currentLocation);
        });
        window.addEventListener('popstate', this.redirectCallBack);
        this.addListeners();
    }

    public addListeners() {
        const loginBtn = document.getElementById('login-btn');
        const registrBtn = document.getElementById('registration-btn');
        loginBtn?.addEventListener('click', () => {
            window.location.href = ROUTE.LOGIN;
        });
        registrBtn?.addEventListener('click', () => {
            window.location.href = ROUTE.REGISTRATION;
        });
    }

    redirectCallBack(e: PopStateEvent): void {
        this.app?.setCurrentPage(window.location.pathname.slice(1));
    }
}
