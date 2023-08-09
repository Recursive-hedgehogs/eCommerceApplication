import Header from '../components/header/header';
import { IApp, IView } from '../models/interfaces/interface';
import LoginPage from '../pages/login-page/login-page';
import ElementCreator from '../utils/template-creation';

class View implements IView {
    public model: IApp | null;

    constructor() {
        this.model = null;
    }

    public start(model: IApp) {
        this.model = model;
    }

    public build(): void {
        const header = new Header().getElement();
        const loginPage = new LoginPage().getElement();
        document.body.append(header, loginPage);
    }
}

export default View;
