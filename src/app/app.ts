import { IApp, IView } from '../models/interfaces/interface';
import {ROUTE} from "../models/enums/enum";
import {Router} from "../router/router";

class App implements IApp {
    public view: IView | null;
    private router: Router;

    constructor() {
        this.view = null;
        this.router = new Router();
    }

    public start(view: IView): void {
        this.view = view;
    }

    public buildView(): void {
        if (this.view) {
            this.view.build();
        }
        document.body!.addEventListener('click', () => this.router.navigate())
    }



}

export default App;
