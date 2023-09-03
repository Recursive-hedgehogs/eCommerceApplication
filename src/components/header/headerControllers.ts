import App from '../../app/app';
import { ROUTE } from '../../constants/enums/enum';
import { Router } from '../../router/router';
export class HeaderControllers {
    private app: App;
    private router: Router;

    constructor() {
        this.app = new App();
        this.router = new Router();
        this.addListeners();
    }

    addListeners(): void {
        const loginBtn: HTMLElement | null = document.getElementById('login-btn');
        const logoutBtn: HTMLElement | null = document.getElementById('logout-btn');
        const registrBtn: HTMLElement | null = document.getElementById('registration-btn');
        const profileBtn: HTMLElement | null = document.getElementById('profile-btn');
        const logoLink: HTMLElement | null = document.getElementById('main-logo');
        loginBtn?.addEventListener('click', (): void => {
            if (this.app?.isAuthenticated()) {
                this.router.navigate(ROUTE.MAIN); //redirecting to the Main page, if user is authenticated
            } else {
                this.router.navigate(ROUTE.LOGIN); // else to the login page
            }
            this.router.navigate(ROUTE.LOGIN);
        });
        logoutBtn?.addEventListener('click', (): void => {
            this.app?.setAuthenticationStatus(false); // set authentication state
            this.router.navigate(ROUTE.LOGIN); // else to the login page
            logoutBtn.classList.add('hidden');
            profileBtn?.classList.add('hidden');
            loginBtn?.classList.remove('hidden');
            registrBtn?.classList.remove('hidden');
            localStorage.removeItem('refreshToken');
        });
        registrBtn?.addEventListener('click', (): void => {
            this.router.navigate(ROUTE.REGISTRATION);
        });
        logoLink?.addEventListener('click', (e: MouseEvent): void => {
            e.preventDefault();
            this.router.navigate(ROUTE.MAIN);
        });
        const header: Element | null = document.querySelector('.header');
        header?.addEventListener('click', this.onHeaderClick);
    }

    private onHeaderClick = (e: Event): void => {
        e.preventDefault();
        const target: EventTarget | null = e.target;
        if (target instanceof HTMLElement) {
            switch (target.dataset.link) {
                case ROUTE.LOGIN:
                    this.router.navigate(ROUTE.LOGIN);
                    document.title = 'storiesShelf store | Login';
                    break;
                case ROUTE.REGISTRATION:
                    this.router.navigate(ROUTE.REGISTRATION);
                    document.title = 'storiesShelf store | Registration';
                    break;
                case ROUTE.CATALOG:
                    this.router.navigate(ROUTE.CATALOG);
                    document.title = 'storiesShelf store | Catalog';
                    if (e.target) {
                        this.app?.catalogPage.showCatalog();
                    }
                    break;
                case ROUTE.USER:
                    this.router.navigate(ROUTE.USER);
                    document.title = 'storiesShelf store | User';
                    break;
                case ROUTE.BASKET:
                    this.router.navigate(ROUTE.BASKET);
                    document.title = 'storiesShelf store | Basket';
                    break;
                case ROUTE.ABOUT:
                    this.router.navigate(ROUTE.ABOUT);
                    document.title = 'shelfStories store | About';
                    break;
                case ROUTE.MAIN:
                    this.router.navigate(ROUTE.MAIN);
                    document.title = 'shelfStories store | Main';
                    break;
                default:
                    break;
            }
        }
    };
}
