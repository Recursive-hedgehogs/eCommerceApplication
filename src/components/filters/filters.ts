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
                case 'biography':
                    categories.push('67b55a80-6240-4f8d-bbde-cf9280bb8acb');
                    break;
                case 'thriller':
                    categories.push('4bc97f8a-d44a-47ea-b5d8-82d80579c33f');
                    break;
                case 'novel':
                    categories.push('9178d2f4-2949-405b-9a5e-4c50499bf1b6');
                    break;
                case 'psychology':
                    categories.push('4e796ae1-83e1-4a6d-86a0-b4d61a05cca1');
                    break;
                case 'business':
                    categories.push('8640c4c7-fffb-474b-947b-6d4699b613db');
                    break;
                case 'tolkien':
                    result.push('variants.attributes.author:"tolkien"');
                    break;
                case 'isaacson':
                    result.push('variants.attributes.author:"isaacson"');
                    break;
                case 'minimum':
                    result.push(`variants.price.centAmount: range (${Number(data.get(el)) * 100} to *)`);
                    break;
                case 'maximum':
                    result.push(`variants.price.centAmount: range (* to ${Number(data.get(el)) * 100})`);
                    break;
                case 'english':
                    result.push('variants.attributes.english:"true"');
                    break;
                case 'belarusian':
                    result.push('variants.attributes.belarusian:"true"');
                    break;
            }
        });
        if (categories.length) {
            result.push(`categories.id:"${categories.join('", "')}"`);
        }
        console.log(result, '!!!');
        return result;
    }
}
