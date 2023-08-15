import App from '../app/app';
import { ROUTE } from '../models/enums/enum';

export class Controllers {
    private app: App | null;

    constructor() {
        this.app = null;
    }

    public start(app: App): void {
        this.app = app;
        this.addListeners();
    }

    public addListeners(): void {
        window.addEventListener('load', this.onFirstLoad);
        window.addEventListener('popstate', this.redirectCallBack);

        const loginBtn: HTMLElement | null = document.getElementById('login-btn');
        const registrBtn: HTMLElement | null = document.getElementById('registration-btn');
        loginBtn?.addEventListener('click', (): void => {
            this.app?.setCurrentPage(ROUTE.LOGIN);
        });
        registrBtn?.addEventListener('click', (): void => {
            this.app?.setCurrentPage(ROUTE.REGISTRATION);
        });

        this.app?.view?.pages?.get(ROUTE.MAIN)?.addEventListener('click', this.onMainPageClick);
        this.app?.view?.pages?.get(ROUTE.NOT_FOUND)?.addEventListener('click', this.onNotFoundPageClick);
    }

    private onMainPageClick = (e: Event): void => {
        e.preventDefault();
        const target: EventTarget | null = e.target;
        if (target instanceof HTMLElement) {
            switch (target.dataset.link) {
                case ROUTE.LOGIN:
                    this.app?.setCurrentPage(ROUTE.LOGIN);
                    break;
                case ROUTE.REGISTRATION:
                    this.app?.setCurrentPage(ROUTE.REGISTRATION);
                    break;
                case ROUTE.CATALOG:
                    this.app?.setCurrentPage(ROUTE.CATALOG);
                    break;
                case ROUTE.PRODUCT:
                    this.app?.setCurrentPage(ROUTE.PRODUCT);
                    break;
                case ROUTE.USER:
                    this.app?.setCurrentPage(ROUTE.USER);
                    break;
                case ROUTE.BASKET:
                    this.app?.setCurrentPage(ROUTE.BASKET);
                    break;
                case ROUTE.ABOUT:
                    this.app?.setCurrentPage(ROUTE.ABOUT);
                    break;
                default:
                    break;
            }
        }
    };

    private onNotFoundPageClick = (e: Event) => {
        if (e.target instanceof HTMLElement && e.target.dataset.link === ROUTE.NOT_FOUND) {
            this.app?.setCurrentPage(ROUTE.MAIN);
        }
    };

    private onFirstLoad = (): void => {
        const currentLocation: string = window.location.pathname.slice(1) ? window.location.pathname.slice(1) : 'main';
        this.app?.setCurrentPage(currentLocation);
        window.removeEventListener('load', this.onFirstLoad);
    };

    private redirectCallBack = (e: PopStateEvent): void => {
        const currentPath: string = window.location.pathname.slice(1);
        this.app?.setCurrentPage(currentPath, e.state.page === currentPath);
    };
}
