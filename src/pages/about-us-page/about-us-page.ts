import template from './about-us-page.html';
import ElementCreator from '../../utils/template-creation';
import './about-us-page.scss';

export default class AboutUsPage {
    public element: HTMLElement;

    constructor() {
        this.element = new ElementCreator({
            tag: 'section',
            classNames: [
                'about-us-page',
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
