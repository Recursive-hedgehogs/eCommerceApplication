import { Filters } from './filters';

export class FiltersController {
    private filters: Filters;

    constructor(filters: Filters) {
        this.filters = filters;
        this.addListeners();
    }

    private addListeners(): void {
        this.filters.element?.addEventListener('submit', this.onSubmit);
        this.filters.element?.addEventListener('change', this.onChange);
    }

    private onChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const minResult = this.filters.element?.querySelector('.min-result');
        const maxResult = this.filters.element?.querySelector('.max-result');
        const minSlider = this.filters.element?.querySelector('.min-slider') as HTMLInputElement;
        const maxSlider = this.filters.element?.querySelector('.max-slider') as HTMLInputElement;
        if (minResult && target.id === 'customRangeMin') {
            minResult.innerHTML = target.value;
            maxSlider.min = target.value;
            if (maxSlider.value < target.value) {
                maxSlider.value = target.value;
            }
        }
        if (maxResult && target.id === 'customRangeMax') {
            maxResult.innerHTML = target.value;
            minSlider.max = target.value;
            if (minSlider.value > target.value) {
                minSlider.value = target.value;
            }
        }
    };

    private onSubmit = (e: SubmitEvent) => {
        const filterResult = document.querySelector('.filters-result');
        const map = new Map();
        const filtersArray: string[] = [];
        e.preventDefault();
        console.log(this.filters.element);
        const inputsCheck: NodeListOf<HTMLInputElement> | undefined =
            this.filters.element?.querySelectorAll('input[type=checkbox]');
        const inputsRange: NodeListOf<HTMLInputElement> | undefined =
            this.filters.element?.querySelectorAll('input[type=range]');
        inputsCheck?.forEach((el: HTMLInputElement) => {
            if (el.name && el.checked) {
                filtersArray.push(el.name);
                map.set(el.name, el.checked);
            }
        });
        inputsRange?.forEach((el: HTMLInputElement) => {
            if (el.name && el.value) {
                filtersArray.push(el.name);
                map.set(el.name, el.value);
            }
        });
        if (filterResult) {
            filterResult.innerHTML = filtersArray.join(' ');
        }
        console.log(map);
        this.filters.convertToFilter(map);
    };
}
