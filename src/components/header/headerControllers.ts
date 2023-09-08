import App from '../../app/app';
import { ROUTE } from '../../constants/enums/enum';
import { Router } from '../../router/router';
import Header from './header';
export class HeaderControllers {
    private app: App;
    private router: Router;
    private header: Header;

    constructor() {
        this.app = new App();
        this.header = this.app.header;
        this.router = new Router();
        this.addListeners();
    }

    addListeners(): void {
        const loginBtn: HTMLElement | null = this.header.getElement().querySelector('#login-btn');
        const logoutBtn: HTMLElement | null = this.header.getElement().querySelector('#logout-btn');
        const registrBtn: HTMLElement | null = this.header.getElement().querySelector('#registration-btn');
        const profileBtn: HTMLElement | null = this.header.getElement().querySelector('#profile-btn');
        const logoLink: HTMLElement | null = this.header.getElement().querySelector('#main-logo');
        loginBtn?.addEventListener('click', (): void => {
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
        this.header.getElement().addEventListener('click', this.onHeaderClick);
    }

    private onHeaderClick = (e: Event): void => {
        e.preventDefault();
        const target: EventTarget | null = e.target;
        if (target instanceof HTMLElement) {
            switch (target.dataset.link) {
                case ROUTE.LOGIN:
                    this.router.navigate(ROUTE.LOGIN);
                    document.title = 'storiesShelf store | Login';
                    this.setActiveLink(target);
                    break;
                case ROUTE.REGISTRATION:
                    this.router.navigate(ROUTE.REGISTRATION);
                    document.title = 'storiesShelf store | Registration';
                    this.setActiveLink(target);
                    break;
                case ROUTE.CATALOG:
                    this.router.navigate(ROUTE.CATALOG);
                    document.title = 'storiesShelf store | Catalog';
                    this.setActiveLink(target);
                    if (e.target) {
                        this.app?.catalogPage.showCatalog();
                    }
                    break;
                case ROUTE.USER:
                    this.router.navigate(ROUTE.USER);
                    document.title = 'storiesShelf store | User';
                    this.setActiveLink(target);
                    break;
                case ROUTE.BASKET:
                    this.router.navigate(ROUTE.BASKET);
                    document.title = 'storiesShelf store | Basket';
                    this.setActiveLink(target);
                    break;
                case ROUTE.ABOUT:
                    this.router.navigate(ROUTE.ABOUT);
                    document.title = 'shelfStories store | About';
                    this.setActiveLink(target);
                    break;
                case ROUTE.MAIN:
                    this.router.navigate(ROUTE.MAIN);
                    document.title = 'shelfStories store | Main';
                    this.setActiveLink(target);
                    break;
                default:
                    break;
            }
        }
    };

    private setActiveLink = (targetLink: HTMLElement) => {
        const links = this.header.getElement().querySelectorAll('.nav-link');
        links.forEach((link) => {
            link.classList.remove('active');
        });
        targetLink.classList.add('active');
    };
}
