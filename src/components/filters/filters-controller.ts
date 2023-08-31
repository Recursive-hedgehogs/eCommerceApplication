import { Filters } from './filters';

export class FiltersController {
    private filters: Filters;

    constructor(filters: Filters) {
        this.filters = filters;
        this.addListeners();
    }

    private addListeners(): void {
        this.filters.element?.addEventListener('submit', this.onSubmit);
    }

    private onSubmit = (e: SubmitEvent) => {
        const filterResult = document.querySelector('.filters-result');
        const map = new Map();
        const filtersArray: string[] = [];
        e.preventDefault();
        console.log(this.filters.element);
        const inputs = this.filters.element?.querySelectorAll('input');
        inputs?.forEach((el) => {
            if (el.name && el.checked) {
                filtersArray.push(el.name);
                // map.set(el.name, el.checked);
                // if (filterResult) {
                //     filterResult.innerHTML = el.name
                // }
            }
        });
        if (filterResult) {
            filterResult.innerHTML = filtersArray.join(' ');
        }
        console.log(filtersArray);
    };
}
