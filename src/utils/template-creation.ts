import { IElementParams } from '../constants/interfaces/interface';

class ElementCreator<T extends HTMLElement> {
    element: T | null;
    constructor(params: IElementParams) {
        this.element = null;
        this.createElement(params);
    }

    public getElement(): T {
        if (this.element) {
            return this.element;
        } else {
            throw new Error('Element is null');
        }
    }

    public createElement(params: IElementParams): void {
        const tag: string = params.tag;
        this.element = document.createElement(tag) as T;
        this.setCssClasses(params.classNames);
        if (params.textContent) this.setTextContent(params.textContent);
        if (params.innerHTML) this.setInnerHTML(params.innerHTML);
        if (params.background) this.element.style.backgroundImage = `url('${params.background}')`;
    }

    public setCssClasses(cssClasses: Array<string>): void {
        cssClasses?.map((cssClass: string) => this.element?.classList.add(cssClass));
    }

    public setTextContent(text: string, emptyText = ''): void {
        if (this.element) {
            text ? (this.element.textContent = text) : (this.element.textContent = emptyText);
        }
    }

    public setInnerHTML(html?: string): void {
        if (this.element) {
            this.element.innerHTML = html ?? '';
        }
    }
}

export default ElementCreator;
