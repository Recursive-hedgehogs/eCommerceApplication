// export function createTemplate<Type>(htmlFromString: string): Type {
//     const template: HTMLTemplateElement = document.createElement('template');
//     template.innerHTML = htmlFromString;
//     return template.content.firstChild as Type;
// }

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

    createElement(params: IElementParams) {
        const tag: string = params.tag;
        this.element = document.createElement(tag) as T;
        this.setCssClasses(params.classNames);
        if (params.textContent) this.setTextContent(params.textContent);
        if (params.innerHTML) this.setInnerHTML(params.innerHTML);
    }

    setCssClasses(cssClasses: Array<string>) {
        cssClasses?.map((cssClass) => this.element?.classList.add(cssClass));
    }

    setTextContent(text: string, emptyText = '') {
        if (this.element) {
            text ? (this.element.textContent = text) : (this.element.textContent = emptyText);
        }
    }

    setInnerHTML(html: string, emptyHTML = '') {
        if (this.element) {
            html ? (this.element.innerHTML = html) : (this.element.innerHTML = emptyHTML);
        }
    }
}

export default ElementCreator;
