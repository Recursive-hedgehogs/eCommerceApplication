import ElementCreator from '../../utils/template-creation';
import template from './filters.html';
import { ApiProduct } from '../../api/api-products/api-products';

export class Filters {
    private readonly _element: HTMLElement;
    private apiProduct = new ApiProduct();

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
        [...data.keys()].forEach((el) => {
            switch (el) {
                case 'fantasy':
                    result.push('categories.id:"96df4d23-484f-4ec0-a1c1-39c077a3aefd"');
                    break;
                case 'minimum':
                    result.push(`variants.price.centAmount: range (${Number(data.get(el)) * 100} to *)`);
                    break;
                case 'english':
                    result.push('variants.attributes.english:"true"');
            }
        });
        console.log(result);
        this.apiProduct
            .getProductProjection(result)
            ?.then((res) => console.log(res))
            .catch((err) => console.log(err));
    }
}
