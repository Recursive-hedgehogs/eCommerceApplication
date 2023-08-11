import App from '../app/app';

export class Controllers {
    private app: App | null;
    constructor() {
        this.app = null;
    }

    public start(app: App) {
        this.app = app;
        window.addEventListener('load', () => {
            console.log('gs');
            this.app?.setCurrentPage(window.location.pathname.slice(1));
        });
        window.addEventListener('popstate', this.redirectCallBack);
    }

    redirectCallBack(): void {
        this.app?.setCurrentPage(window.location.pathname.slice(1));
    }
}
