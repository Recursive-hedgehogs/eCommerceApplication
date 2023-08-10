import App from '../app/app';

export class Controllers {
    private app: App;
    constructor(app: App) {
        this.app = app;
    }

    redirectCallBack(): void {
        this.app.setCurrentPage(window.location.pathname.slice(1));
    }
}
