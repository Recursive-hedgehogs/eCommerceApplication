import ElementCreator from '../../utils/template-creation';
import './main.scss';

export default class Main {
    element: HTMLElement;

    constructor() {
        this.element = new ElementCreator({
            tag: 'main',
            classNames: ['main'],
        }).getElement();
    }

    public getElement(): HTMLElement {
        return this.element;
    }

    public setContent(page: HTMLElement | undefined) {
        if (page) {
            this.element.append(page);
        }
    }
}
