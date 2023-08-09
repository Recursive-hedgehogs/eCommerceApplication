import Header from '../components/header/header';
import { IApp, IView } from '../models/interfaces/interface';
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
        document.body.append(header);
    }
}

export default View;
