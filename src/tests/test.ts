import * as packageJson from '../../package.json';
//jest.mock('iso-3166');
//import App from '../app/app';
//import View from '../view/view';
//import { Controllers } from '../controllers/controllers';
//import { ROUTE } from '../models/enums/enum';
//import { apiCustomer } from '../api/api-customer';

test('Husky is configured in package.json', () => {
    expect(packageJson.husky).toBeDefined();
});

test('Husky is installed and configured properly', () => {
    const huskyConfig = packageJson.husky;
    expect(huskyConfig.hooks['pre-commit']).toBeDefined();
    expect(huskyConfig.hooks['pre-commit']).toBe('lint');
});

/*test('setCurrentPage redirects to MAIN when authenticated user goes to LOGIN', () => {
    const app = new App();
    app.setAuthenticationStatus(true);
    const setCurrentPageSpy = jest.spyOn(app, 'setCurrentPage');

    app.setCurrentPage(ROUTE.LOGIN);

    expect(setCurrentPageSpy).toHaveBeenCalledWith(ROUTE.MAIN);
});

test('setAuthenticationStatus sets authentication status', () => {
    const app = new App();

    app.setAuthenticationStatus(true);

    expect(app.isAuthenticated()).toBe(true);
});

test('isAuthenticated returns correct authentication status', () => {
    const app = new App();

    app.setAuthenticationStatus(false);

    expect(app.isAuthenticated()).toBe(false);

    app.setAuthenticationStatus(true);

    expect(app.isAuthenticated()).toBe(true);
});

test('start sets the view property', () => {
    const app = new App();
    const mockView = {} as View;

    app.start(mockView);

    expect(app.view).toBe(mockView);
});*/
