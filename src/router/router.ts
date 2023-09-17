import App from '../app/app';
import { ROUTE } from '../constants/enums/enum';

export class Router {
    private app?: App;
    private static singleton: Router;

    constructor() {
        return Router.singleton ?? (Router.singleton = this);
    }

    public start(app: App): void {
        this.app = app;
    }

    public navigate(route: string, isUpdate?: boolean): void {
        const currentPath: string = window.location.pathname;
        if (this.app?.view && this.app?.view.pages) {
            if (route === ROUTE.LOGIN && this.app.isAuthenticated()) {
                route = ROUTE.MAIN;
            }
            const isProductPageRegex = /product\/[\w\d-]*/;
            const isProductPage: boolean = isProductPageRegex.test(route);
            let page: HTMLElement | undefined = this.app?.view.pages.has(route)
                ? this.app?.view.pages.get(route)
                : this.app?.view.pages.get(ROUTE.NOT_FOUND);
            if (isProductPage) {
                page = this.app?.view.pages.get(ROUTE.PRODUCT);
            }
            this.app?.main.setContent(page);
            this.onNavigate(route);
        }

        if (currentPath !== `/${route}`) {
            if (isUpdate) {
                history.replaceState({ route }, '', `/${route}`);
            } else {
                history.pushState({ route }, '', `/${route}`);
            }
        }
    }

    private onNavigate(page: string): void {
        const isProductPageRegex = /product\/[\w\d-]*/;
        const isProductPage: boolean = isProductPageRegex.test(page);
        switch (page) {
            case ROUTE.CATALOG:
                this.app?.catalogPage.showCatalog();
        }
        if (isProductPage) {
            const productId: string = page.slice(8);
            this.app?.basketPage.isProductInBasket(productId).then((isInBasket) => {
                this.app?.productPage.getData(productId, isInBasket);
            });
        }
    }
}
