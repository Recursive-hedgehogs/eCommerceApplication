import ElementCreator from '../../utils/template-creation';

export class Main {
    readonly element: HTMLElement;
    private static singleton: Main;

    constructor() {
        this.element = new ElementCreator({
            tag: 'main',
            classNames: ['main', 'd-flex', 'flex-column', 'flex-grow-1'],
        }).getElement();
        return Main.singleton ?? (Main.singleton = this);
    }

    public getElement(): HTMLElement {
        return this.element;
    }

    public setContent(page: HTMLElement | undefined): void {
        if (page) {
            this.element.innerHTML = '';
            this.element.append(page);
        }
    }
}
