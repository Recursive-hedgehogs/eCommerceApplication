import { ROUTE } from '../models/enums/enum';

export class Router {
    constructor() {
        this.setCurrentPage();
    }

    setCurrentPage(): void {
        const location: ROUTE = window.location.pathname.slice(1) as ROUTE;
        history.pushState({ page: location }, 'title', location);
    }

    navigate(): void {
        history.go(1);
        history.back();
    }
}
