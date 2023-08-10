import { IApp } from '../models/interfaces/interface';
import { Router } from '../router/router';
import ElementCreator from '../utils/template-creation';
import { Controllers } from '../controllers/controllers';
import View from '../view/view';
import {ROUTE} from "../models/enums/enum";

class App implements IApp {
    public view: View | null;
    private router: Router;
    private main: ElementCreator<HTMLElement>;
    private controllers: Controllers | null = null;

    constructor(main: ElementCreator<HTMLElement>) {
        this.view = null;
        this.main = main;
        this.router = new Router();
    }

    public start(view: View, controllers: Controllers): void {
        this.view = view;
        this.controllers = controllers;

        window.addEventListener('popstate', this.controllers.redirectCallBack);
        window.addEventListener('load', () => this.setCurrentPage(window.location.pathname.slice(1)));
    }

    public buildView(): void {
        if (this.view) {
            this.view.build();
        }
        document.body.addEventListener('click', () => this.router.navigate());
    }

    setCurrentPage(route: string): void {
        if (this.view && this.view.pages){
            const page: HTMLElement | undefined = this.view.pages.has(route) ? this.view.pages.get(route) : this.view.pages.get(ROUTE.NOT_FOUND)
            this.main.setInnerHTML(page)
        }
    }
}

export default App;
