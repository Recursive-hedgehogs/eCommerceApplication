import ElementCreator from '../../utils/template-creation';
import template from './not-found-page.html';

export default class NotFoundPage {
    public element: HTMLElement;

    constructor() {
        this.element = new ElementCreator({
            tag: 'section',
            classNames: ['not-found-page'],
            innerHTML: template,
        }).getElement();
    }

    public getElement(): HTMLElement {
        return this.element;
    }
}
