import './style.scss';
import './plugins/bootstrap';
import './plugins/fontawesome';
import App from './app/app';
import View from './view/view';
import { Controllers } from './controllers/controllers';

const app: App = new App();
const view: View = new View();
const controllers: Controllers = new Controllers();

app.start(view);
view.start(app);
controllers.start(app);
