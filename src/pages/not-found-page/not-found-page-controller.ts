import NotFoundPage from './not-found-page';
import { ROUTE } from '../../constants/enums/enum';
import App from '../../app/app';
import { Router } from '../../router/router';

export class NotFoundPageController {
    private notFoundPage: NotFoundPage;
    private app: App;
    private router: Router;

    constructor() {
        this.app = new App();
        this.notFoundPage = this.app.notFoundPage;
        this.router = new Router();
        this.addListeners();
    }

    private addListeners(): void {
        this.notFoundPage.element.addEventListener('click', this.onNotFoundPageClick);
    }

    private onNotFoundPageClick = (e: Event): void => {
        if (e.target instanceof HTMLElement && e.target.dataset.link === ROUTE.NOT_FOUND) {
            this.router.navigate(ROUTE.MAIN);
        }
    };
}
