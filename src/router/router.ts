import { ROUTE } from '../models/enums/enum';

export class Router {
    constructor() {
        this.setCurrentPage();
    }

    setCurrentPage(): void {
        const location = window.location.pathname.slice(1) as ROUTE;
        if (Object.values(ROUTE).includes(location)) {
            history.pushState({ page: location }, 'title', location);
        } else {
            history.pushState({ page: ROUTE.NOT_FOUND }, 'title', ROUTE.NOT_FOUND);
        }
    }

    navigate(): void {
        history.go(1);
        history.back();
    }
}
