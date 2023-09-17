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
            if (route === ROUTE.CATALOG) {
                route = `${ROUTE.CATALOG}/1`;
            }
            const isProductPageRegex = /product\/[\w\d-]*/;
            const isProductPage: boolean = isProductPageRegex.test(route);
            const isCatalogPageRegex = /catalog\/\d*/;
            const isCatalogPage: boolean = isCatalogPageRegex.test(route);
            let page: HTMLElement | undefined = this.app?.view.pages.has(route)
                ? this.app?.view.pages.get(route)
                : this.app?.view.pages.get(ROUTE.NOT_FOUND);
            if (isProductPage) {
                page = this.app?.view.pages.get(ROUTE.PRODUCT);
            }
            if (isCatalogPage) {
                page = this.app?.view.pages.get(ROUTE.CATALOG);
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
        const isCatalogPageRegex = /catalog\/\d*/;
        const isCatalogPage: boolean = isCatalogPageRegex.test(page);
        switch (page) {
            case ROUTE.CATALOG:
                this.app?.catalogPage.showCatalog();
        }
        if (isProductPage) {
            this.app?.productPage.getData(page.slice(8));
        }
        if (isCatalogPage) {
            this.app?.catalogPage.showCatalog(page.slice(8));
        }
    }
}
