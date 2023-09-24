import ElementCreator from '../../utils/template-creation';
import template from './not-found-page.html';
import './not-found-page.scss';

export default class NotFoundPage {
    public element: HTMLElement;

    constructor() {
        this.element = new ElementCreator({
            tag: 'section',
            classNames: [
                'not-found-page',
                'd-flex',
                'flex-column',
                'align-items-center',
                'justify-content-around',
                'flex-grow-1',
            ],
            innerHTML: template,
        }).getElement();
    }

    public getElement(): HTMLElement {
        return this.element;
    }
}
