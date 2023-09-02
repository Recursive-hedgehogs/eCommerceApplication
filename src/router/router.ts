import App from '../app/app';
import { ROUTE } from '../constants/enums/enum';

export class Router {
    private app?: App;
    private static singleton: Router;

    constructor() {
        return Router.singleton ?? (Router.singleton = this);
    }

    public start(app: App) {
        this.app = app;
    }

    public navigate(route: string, isUpdate?: boolean): void {
        const currentPath: string = window.location.pathname;
        if (this.app?.view && this.app?.view.pages) {
            if (route === ROUTE.LOGIN && this.app.isAuthenticated()) {
                route = ROUTE.MAIN;
            }
            console.log(route);
            const isProductPageRegex = /product\/[\w\d-]*/;
            const isProductPage = isProductPageRegex.test(route);
            let page: HTMLElement | undefined = this.app?.view.pages.has(route)
                ? this.app?.view.pages.get(route)
                : this.app?.view.pages.get(ROUTE.NOT_FOUND);
            if (isProductPage) {
                page = this.app?.view.pages.get(ROUTE.PRODUCT);
            }
            this.app?.main.setContent(page);
        }

        if (currentPath !== `/${route}`) {
            if (isUpdate) {
                history.replaceState({ route }, '', `/${route}`);
            } else {
                history.pushState({ route }, '', `/${route}`);
            }
        }
    }

    // public setCurrentPage(route: string, isUpdate?: boolean): void {
    //     if (this.view && this.view.pages) {
    //         if (route === ROUTE.LOGIN && this.isAuthenticated()) {
    //             route = ROUTE.MAIN;
    //         }
    //         const page: HTMLElement | undefined = this.view.pages.has(route)
    //             ? this.view.pages.get(route)
    //             : this.view.pages.get(ROUTE.NOT_FOUND);
    //         this.router.setCurrentPage(route, isUpdate);
    //         this.main.setContent(page);
    //     }
    // }
}
