export class Router {
    public setCurrentPage(page: string): void {
        history.pushState({ page: page }, 'title', page);
    }

    private navigate(): void {
        history.go(1);
        history.back();
    }
}
