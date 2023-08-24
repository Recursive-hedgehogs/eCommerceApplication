import { IElementParams } from '../models/interfaces/interface';

class ElementCreator<T extends HTMLElement> {
    element: T | null;
    constructor(params: IElementParams) {
        this.element = null;
        this.createElement(params);
    }

    getElement(): T {
        if (this.element) {
            return this.element;
        } else {
            throw new Error('Element is null');
        }
    }

    createElement(params: IElementParams): void {
        const tag: string = params.tag;
        this.element = document.createElement(tag) as T;
        this.setCssClasses(params.classNames);
        if (params.textContent) this.setTextContent(params.textContent);
        if (params.innerHTML) this.setInnerHTML(params.innerHTML);
    }

    setCssClasses(cssClasses: Array<string>): void {
        cssClasses?.map((cssClass: string) => this.element?.classList.add(cssClass));
    }

    setTextContent(text: string, emptyText = ''): void {
        if (this.element) {
            text ? (this.element.textContent = text) : (this.element.textContent = emptyText);
        }
    }

    setInnerHTML(html?: string | HTMLElement): void {
        if (this.element) {
            this.element.innerHTML = '';
            if (html instanceof HTMLElement) {
                this.element.append(html);
            } else {
                this.element.innerHTML = html ?? '';
            }
        }
    }
}

export default ElementCreator;
