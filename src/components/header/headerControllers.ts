import App from '../../app/app';
import { ROUTE } from '../../constants/enums/enum';
import { Router } from '../../router/router';
export class HeaderControllers {
    private app: App;
    private router: Router;
    private header: HTMLElement;

    constructor() {
        this.app = new App();
        this.header = this.app.header.getElement();
        this.router = new Router();
        this.addListeners();
    }

    addListeners(): void {
        this.header.addEventListener('click', this.onHeaderClick);
    }

    private onHeaderClick = (e: Event): void => {
        e.preventDefault();
        const target: HTMLElement = <HTMLElement>e.target;
        const linkElement: HTMLElement = <HTMLElement>target?.closest('[data-link]');
        const dataLink: string | undefined = linkElement?.dataset.link;
        switch (dataLink) {
            case ROUTE.LOGIN:
                this.router.navigate(ROUTE.LOGIN);
                document.title = 'storiesShelf store | Login';
                this.app.header.setActiveLink(target);
                this.highlightUser();
                break;
            case ROUTE.REGISTRATION:
                this.router.navigate(ROUTE.REGISTRATION);
                document.title = 'storiesShelf store | Registration';
                this.app.header.setActiveLink(target);
                this.highlightUser();
                break;
            case ROUTE.CATALOG:
                this.router.navigate(ROUTE.CATALOG);
                document.title = 'storiesShelf store | Catalog';
                this.app.header.setActiveLink(target);
                if (e.target) {
                    this.app?.catalogPage.showCatalog();
                }
                break;
            case ROUTE.USER:
                this.router.navigate(ROUTE.USER);
                document.title = 'storiesShelf store | User';
                this.app.header.setActiveLink(target);
                this.highlightUser();
                break;
            case ROUTE.BASKET:
                this.router.navigate(ROUTE.BASKET);
                document.title = 'storiesShelf store | Basket';
                this.app.header.setActiveLink(target);
                break;
            case ROUTE.ABOUT:
                this.router.navigate(ROUTE.ABOUT);
                document.title = 'shelfStories store | About';
                this.app.header.setActiveLink(target);
                break;
            case ROUTE.MAIN:
                this.router.navigate(ROUTE.MAIN);
                document.title = 'shelfStories store | Main';
                this.app.header.setActiveLink(target);
                break;
            case 'logout':
                this.onLogOut();
                break;
            default:
                break;
        }
    };

    private onLogOut = (): void => {
        const loginBtn: HTMLElement | null = this.header.querySelector('#login-btn');
        const logoutBtn: HTMLElement | null = this.header.querySelector('#logout-btn');
        const registrBtn: HTMLElement | null = this.header.querySelector('#registration-btn');
        const profileBtn: HTMLElement | null = this.header.querySelector('#profile-btn');
        this.app?.setAuthenticationStatus(false); // set authentication state
        this.router.navigate(ROUTE.LOGIN); // else to the login page
        logoutBtn?.classList.add('hidden');
        profileBtn?.classList.add('hidden');
        loginBtn?.classList.remove('hidden');
        registrBtn?.classList.remove('hidden');
        localStorage.removeItem('refreshToken');
    };

    private highlightUser = (): void => {
        const usertLink: HTMLElement = <HTMLElement>this.header.querySelector('.user-link');
        if (usertLink) usertLink.classList.add('active');
    };
}
