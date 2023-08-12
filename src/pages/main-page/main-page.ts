import template from './main-page.html';
import ElementCreator from '../../utils/template-creation';

export default class MainPage {
    public element: HTMLElement;

    constructor() {
        this.element = new ElementCreator({
            tag: 'section',
            classNames: ['main-page'],
            innerHTML: template,
        }).getElement();
        const a = this.element.querySelector('a');
        console.log(a);
        a?.addEventListener('click', (e) => {
            console.log(11111111);
            e.preventDefault();
            history.pushState('fdg', 'fd', 'login');
            document.querySelector('main')!.innerHTML = 'login';
        });
        // this.element.addEventListener('click', (e: MouseEvent) => {
        //     // e.preventDefault();
        //     console.log('gsdfh');
        // });
    }

    public getElement(): HTMLElement {
        return this.element;
    }
}
