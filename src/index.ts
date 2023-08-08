import './style.scss';
import './plugins/bootstrap';
import './plugins/fontawesome';
import App from './app/app';
import View from './view/view';

const app = new App();
const view = new View();

app.start(view);
view.start(app);

app.buildView();
