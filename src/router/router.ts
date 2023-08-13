export class Router {
    public setCurrentPage(page: string, isUpdate?: boolean): void {
        if (isUpdate) {
            history.replaceState({ page }, '', page);
        } else {
            history.pushState({ page }, '', page);
        }
    }

}
