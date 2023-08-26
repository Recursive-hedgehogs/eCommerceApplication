import './style.scss';
import './plugins/bootstrap';
import './plugins/fontawesome';
import App from './app/app';
import View from './view/view';
import { Controllers } from './controllers/controllers';
import { Router } from './router/router';

const app: App = new App();
const view: View = new View(app);
const controllers: Controllers = new Controllers();
const router: Router = new Router();

app.start(view);
// view.start(app);
router.start(app);
controllers.start(app);
