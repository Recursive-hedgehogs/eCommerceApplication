import './style.scss';
import './plugins/bootstrap';
import './plugins/fontawesome';
import App from './app/app';
import View from './view/view';
import ElementCreator from './utils/template-creation';
import { Controllers } from './controllers/controllers';

const main: ElementCreator<HTMLElement> = new ElementCreator({
    tag: 'main',
    classNames: ['main'],
});
const app: App = new App(main);
const view: View = new View(main);
const controllers: Controllers = new Controllers(app);

app.start(view, controllers);
view.start(app);

app.buildView();
