import ElementCreator from '../../utils/template-creation';
import template from './header.template.html';
import './header.scss';

export default class Header {
    private readonly element: HTMLElement;

    constructor() {
        this.element = new ElementCreator({
            tag: 'header',
            classNames: ['header'],
            innerHTML: template,
        }).getElement();
    }

    public getElement(): HTMLElement {
        console.log('build header');
        return this.element;
    }

    private setActiveLink = (targetLink: HTMLElement) => {
        const links = this.element.querySelectorAll('.nav-link');
        links.forEach((link) => {
            link.classList.remove('active');
        });
        targetLink.classList.add('active');
    };
}
