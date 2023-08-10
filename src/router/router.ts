export class Router {
    constructor() {
        this.setCurrentPage();
    }

    setCurrentPage(): void {
        const location: string = window.location.pathname.slice(1);
        history.pushState({ page: location }, 'title main', location);
    }

    navigate(): void {
        history.go(1);
        history.back();
    }
}
