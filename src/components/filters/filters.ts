import ElementCreator from '../../utils/template-creation';
import template from './filters.html';

export class Filters {
    private readonly _element: HTMLElement;

    constructor() {
        this._element = new ElementCreator({
            tag: 'div',
            classNames: ['filters-container', 'd-flex', 'flex-column'],
            innerHTML: template,
        }).getElement();
    }

    public get element(): HTMLElement | null {
        return this._element;
    }

    public convertToFilter(data: Map<string, string | boolean>) {
        const result: string[] = [];
        const categories: string[] = [];
        [...data.keys()].forEach((el) => {
            switch (el) {
                case 'fantasy':
                    categories.push('96df4d23-484f-4ec0-a1c1-39c077a3aefd');
                    break;
                case 'classic':
                    categories.push('fd19acd7-7680-46ea-b265-3557e2bd37e9');
                    break;
                case 'minimum':
                    result.push(`variants.price.centAmount: range (${Number(data.get(el)) * 100} to *)`);
                    break;
                case 'maximum':
                    result.push(`variants.price.centAmount: range (* to ${Number(data.get(el)) * 100})`);
                    break;
                case 'english':
                    result.push('variants.attributes.english:"true"');
            }
        });
        result.push(`categories.id:"${categories.join('", "')}"`);
        console.log(result);
        return result;
    }
}
