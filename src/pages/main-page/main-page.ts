import './main-page.scss';
import template from './main-page.html';
import ElementCreator from '../../utils/template-creation';

export default class MainPage {
    public element: HTMLElement;

    constructor() {
        this.element = new ElementCreator({
            tag: 'section',
            classNames: [
                'main-page',
                'flex-grow-1',
                'd-flex',
                'flex-column',
                'justify-content-between',
                'align-items-center',
            ],
            innerHTML: template,
        }).getElement();
    }

    public getElement(): HTMLElement {
        return this.element;
    }
}
