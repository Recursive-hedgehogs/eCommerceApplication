import { IApp, IView } from '../models/interfaces/interface';

class App implements IApp {
    public view: IView | null;

    constructor() {
        this.view = null;
    }

    public start(view: IView): void {
        this.view = view;
    }

    public buildView(): void {
        if (this.view) {
            this.view.build();
        }
    }
}

export default App;
