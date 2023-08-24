import ElementCreator from '../../utils/template-creation';
import './message.scss';

export default class Message {
    private _element: HTMLElement | null = null;

    constructor(text: string) {
        this._element = new ElementCreator({
            tag: 'div',
            classNames: ['message', 'fixed-bottom', 'left-0', 'bg-primary', 'text-center', 'fs-4'],
            innerHTML: text,
        }).getElement();
    }

    public get element(): HTMLElement | null {
        return this._element;
    }

    public removeElement() {
        this._element = null;
    }
}
