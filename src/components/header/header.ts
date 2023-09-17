import ElementCreator from '../../utils/template-creation';
import template from './header.template.html';
import './header.scss';
import { ROUTE } from '../../constants/enums/enum';

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
        const currentPath = window.location.pathname.slice(1);
        const currentLink: HTMLElement = <HTMLElement>this.element.querySelector(`[data-link="${currentPath}"]`);
        if (currentLink) {
            this.setActiveLink(currentLink);
        } else {
            const catalogPage: HTMLElement = <HTMLElement>this.element.querySelector(`[data-link="catalog"]`);
            this.setActiveLink(catalogPage);
        }
        this.highlightUser();
        return this.element;
    }

    private setActiveLink = (targetLink: HTMLElement) => {
        const links = this.element.querySelectorAll('.nav-link');
        links.forEach((link) => {
            link.classList.remove('active');
        });
        targetLink.classList.add('active');
    };

    public setItemsNumInBasket(count: number): void {
        const number = this.element.querySelector('.number-book');
        if (number) number.textContent = String(count);
    }

    private highlightUser(): void {
        if (
            window.location.pathname.slice(1) === ROUTE.LOGIN ||
            window.location.pathname.slice(1) === ROUTE.REGISTRATION ||
            window.location.pathname.slice(1) === ROUTE.USER
        ) {
            const usertLink: HTMLElement = <HTMLElement>this.element.querySelector('.user-link');
            if (usertLink) usertLink.classList.add('active');
        }
    }
}
