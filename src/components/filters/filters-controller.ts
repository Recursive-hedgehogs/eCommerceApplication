import { Filters } from './filters';
import CatalogPage from '../../pages/catalog-page/catalog-page';

export class FiltersController {
    private filters: Filters;
    private catalogPage: CatalogPage;

    constructor(filters: Filters, catalogPage: CatalogPage) {
        this.filters = filters;
        this.catalogPage = catalogPage;
        this.addListeners();
    }

    private addListeners(): void {
        this.filters.element?.addEventListener('submit', this.onSubmit);
        this.filters.element?.addEventListener('change', this.onChange);
        this.filters.element?.addEventListener('click', this.onClick);
    }

    private onChange = (e: Event): void => {
        const target: HTMLInputElement = e.target as HTMLInputElement;
        const minResult: HTMLInputElement = this.filters.element?.querySelector('.min-result') as HTMLInputElement;
        const maxResult: HTMLInputElement = this.filters.element?.querySelector('.max-result') as HTMLInputElement;
        const minSlider: HTMLInputElement = this.filters.element?.querySelector('.min-slider') as HTMLInputElement;
        const maxSlider: HTMLInputElement = this.filters.element?.querySelector('.max-slider') as HTMLInputElement;
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

    private onSubmit = (e: SubmitEvent): void => {
        const filterResult: Element | null = document.querySelector('.filters-result');
        const map: Map<string, string | boolean> = new Map();
        const filtersArray: string[] = [];
        e.preventDefault();
        console.log(this.filters.element);
        const inputsCheck: NodeListOf<HTMLInputElement> | undefined =
            this.filters.element?.querySelectorAll('input[type=checkbox]');
        const inputsRange: NodeListOf<HTMLInputElement> | undefined =
            this.filters.element?.querySelectorAll('input[type=range]');
        inputsCheck?.forEach((el: HTMLInputElement): void => {
            if (el.name && el.checked) {
                filtersArray.push(el.name);
                map.set(el.name, el.checked);
            }
        });
        inputsRange?.forEach((el: HTMLInputElement): void => {
            if (
                el.value &&
                ((el.name === 'minimum' && el.value !== '0') || (el.name === 'maximum' && el.value !== '100'))
            ) {
                filtersArray.push(el.name);
                map.set(el.name, el.value);
            }
        });
        if (filterResult) {
            filterResult.innerHTML = filtersArray.join(' ');
        }
        const filter: string[] = this.filters.convertToFilter(map);
        this.catalogPage.updateContent({ filter });
    };

    public onClick = (e: Event): void => {
        const inputsCheck: NodeListOf<HTMLInputElement> | undefined =
            this.filters.element?.querySelectorAll('input[type=checkbox]');
        const minInput: HTMLInputElement = this.filters.element?.querySelector('#customRangeMin') as HTMLInputElement;
        const maxInput: HTMLInputElement = this.filters.element?.querySelector('#customRangeMax') as HTMLInputElement;
        const minResult: HTMLDivElement = this.filters.element?.querySelector('.min-result') as HTMLDivElement;
        const maxResult: HTMLDivElement = this.filters.element?.querySelector('.max-result') as HTMLDivElement;
        const target: HTMLButtonElement = e.target as HTMLButtonElement;
        if (target.id === 'filters-reset') {
            this.catalogPage.updateContent({});
            const filterResult: HTMLElement = document.querySelector('.filters-result') as HTMLElement;
            filterResult.innerHTML = '';
            inputsCheck?.forEach((el: HTMLInputElement): boolean => (el.checked = false));
            if (minInput && maxInput) {
                (<HTMLInputElement>minInput).min = '0';
                (<HTMLInputElement>minInput).max = '100';
                (<HTMLInputElement>minInput).value = '0';
                minResult.innerHTML = '0';
                (<HTMLInputElement>maxInput).min = '0';
                (<HTMLInputElement>maxInput).max = '100';
                (<HTMLInputElement>maxInput).value = '100';
                maxResult.innerHTML = '100';
            }
        }
    };
}
