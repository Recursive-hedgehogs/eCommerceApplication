import { Pagination } from './pagination';
import { PageItem } from './pages-item/page-item';

export class PaginationController {
    private pagination: Pagination;

    constructor(pagination: Pagination) {
        this.pagination = pagination;
        this.addListeners();
    }

    private addListeners(): void {
        this.pagination.prev.addEventListener('click', this.onPrevClick);
        this.pagination.next.addEventListener('click', this.onNextClick);
    }

    public updateListeners(): void {
        this.pagination.pages?.forEach(({ element }: PageItem, i: number) =>
            element.addEventListener('click', (): void => {
                this.onPageClick(i);
            })
        );
    }

    private onPrevClick = (): void => {
        if (this.pagination.currentPage > 0) {
            this.pagination.currentPage -= 1;
        }
    };

    private onNextClick = (): void => {
        if (this.pagination.pages?.length && this.pagination.currentPage < this.pagination.pages?.length - 1) {
            this.pagination.currentPage += 1;
        }
    };

    private onPageClick(i: number): void {
        this.pagination.currentPage = i;
    }
}
