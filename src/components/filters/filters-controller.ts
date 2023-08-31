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
        const map = new Map();
        e.preventDefault();
        console.log(this.filters.element);
        const inputs = this.filters.element?.querySelectorAll('input');
        inputs?.forEach((el) => {
            if (el.name && el.checked) {
                map.set(el.name, el.checked);
            }
        });

        console.log(map);
    };
}
