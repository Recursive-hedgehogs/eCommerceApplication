import ElementCreator from '../../utils/template-creation';

export default class Main {
    element: HTMLElement;

    constructor() {
        this.element = new ElementCreator({
            tag: 'main',
            classNames: ['main', 'd-flex', 'flex-column', 'flex-grow-1'],
        }).getElement();
    }

    public getElement(): HTMLElement {
        return this.element;
    }

    public setContent(page: HTMLElement | undefined) {
        if (page) {
            this.element.innerHTML = '';
            this.element.append(page);
        }
    }
}

export const main: Main = new Main();
