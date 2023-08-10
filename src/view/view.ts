import { IApp, IView } from '../models/interfaces/interface';
import LoginPage from '../pages/login-page/login-page';
import Header from '../components/header/header';
import MainPage from '../pages/main-page/main-page';
import ElementCreator from '../utils/template-creation';

class View implements IView {
    public model: IApp | null;
    private main: ElementCreator<HTMLElement>;

    constructor() {
        this.model = null;
        this.main = new ElementCreator({
            tag: 'main',
            classNames: ['main'],
        });
    }

    public start(model: IApp): void {
        this.model = model;
    }

    public build(): void {
        const header: HTMLElement = new Header().getElement();
        const mainPage: HTMLElement = new MainPage().getElement();
        const loginPage: HTMLElement = new LoginPage().getElement();
        this.main.setInnerHTML(mainPage);
        document.body.append(header, this.main.getElement(), loginPage);
    }
}

export default View;
