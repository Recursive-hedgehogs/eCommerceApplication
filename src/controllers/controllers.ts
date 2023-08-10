import App from '../app/app';

export class Controllers {
    private app: App;
    constructor(app: App) {
        this.app = app;
    }

    redirectCallBack(e: PopStateEvent): void {
        console.log(e.state.page);
        this.app.setCurrentPage(e.state.page);
    }
}
