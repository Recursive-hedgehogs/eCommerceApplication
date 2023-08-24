export class Router {
    public setCurrentPage(page: string, isUpdate?: boolean): void {
        const currentPath = window.location.pathname.slice(1);

        if (currentPath !== page) {
            if (isUpdate) {
                history.replaceState({ page }, '', page);
            } else {
                history.pushState({ page }, '', page);
            }
        }
    }
}
