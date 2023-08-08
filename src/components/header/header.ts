import ElementCreator from '../../utils/template-creation';
import { getTemplate } from './header.template';
import './header.scss';

export default class Header {
    element: HTMLElement;

    constructor() {
        this.element = new ElementCreator({
            tag: 'header',
            classNames: ['header'],
            innerHTML: getTemplate(),
        }).getElement();
    }

    public getElement(): HTMLElement {
        return this.element;
    }
}
