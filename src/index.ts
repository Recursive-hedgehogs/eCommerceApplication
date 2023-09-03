import './style.scss';
import './plugins/bootstrap';
import './plugins/fontawesome';
import App from './app/app';
import View from './view/view';
import { Controllers } from './controllers/controllers';
import { Router } from './router/router';
import { register } from 'swiper/element/bundle';
register();

const app: App = new App();
const view: View = new View(app);
const controllers: Controllers = new Controllers();
const router: Router = new Router();

app.start(view);
router.start(app);
controllers.start(app);
