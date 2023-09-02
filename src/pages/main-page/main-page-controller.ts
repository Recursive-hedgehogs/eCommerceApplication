import MainPage from './main-page';
import { ROUTE } from '../../constants/enums/enum';
import App from '../../app/app';
import { Router } from '../../router/router';

export class MainPageController {
    private app: App;
    private router: Router;
    private mainPage: MainPage;

    constructor() {
        this.app = new App();
        this.router = new Router();
        this.mainPage = this.app.mainPage;
        this.addListeners();
    }

    addListeners(): void {
        this.mainPage.element.addEventListener('click', this.onMainPageClick);
    }

    private onMainPageClick = (e: Event): void => {
        e.preventDefault();
        const target: EventTarget | null = e.target;
        if (target instanceof HTMLElement) {
            switch (target.dataset.link) {
                case ROUTE.CATALOG:
                    this.router.navigate(ROUTE.CATALOG);
                    document.title = 'storiesShelf store | Catalog';
                    if (e.target) {
                        this.app?.catalogPage.showCatalog();
                    }
                    break;
                case ROUTE.ABOUT:
                    this.router.navigate(ROUTE.ABOUT);
                    document.title = 'shelfStories store | About';
                    break;
                default:
                    break;
            }
        }
    };
}
