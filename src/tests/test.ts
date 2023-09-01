import * as packageJson from '../../package.json';
import App from '../app/app';
import View from '../view/view';
import 'jest-fetch-mock';

test('Husky is configured in package.json', () => {
    expect(packageJson.husky).toBeDefined();
});

test('Husky is installed and configured properly', () => {
    const huskyConfig: { hooks: { 'pre-commit': string } } = packageJson.husky;
    expect(huskyConfig.hooks['pre-commit']).toBeDefined();
    expect(huskyConfig.hooks['pre-commit']).toBe('lint');
});

// describe('App', () => {
//     let app: App;
//
//     beforeEach(() => {
//         app = new App();
//     });
//
//     test('setAuthenticationStatus sets authentication status', () => {
//         app.setAuthenticationStatus(true);
//         expect(app.isAuthenticated()).toBe(true);
//     });
//
//     test('isAuthenticated returns correct authentication status', () => {
//         app.setAuthenticationStatus(false);
//         expect(app.isAuthenticated()).toBe(false);
//         app.setAuthenticationStatus(true);
//         expect(app.isAuthenticated()).toBe(true);
//     });
//
//     test('start sets the view property', () => {
//         const mockView: View = {} as View;
//         app.start(mockView);
//         expect(app.view).toBe(mockView);
//     });
//
//     test('App authentication status is initially set to false', () => {
//         expect(app.isAuthenticated()).toBe(false);
//     });
//
//     test('App authentication status can be toggled', () => {
//         app.setAuthenticationStatus(false);
//         expect(app.isAuthenticated()).toBe(false);
//         app.setAuthenticationStatus(true);
//         expect(app.isAuthenticated()).toBe(true);
//     });
//
//     test('App starts with correct initial view properties', () => {
//         const mockView: View = {} as View;
//         app.start(mockView);
//         expect(app.view).toBe(mockView);
//     });
//
//     test('setCurrentPage redirects to MAIN when authenticated user goes to LOGIN', () => {
        // const app: App = new App();
        // app.setAuthenticationStatus(true);
        // app.setCurrentPage(ROUTE.LOGIN);
//     });
// });

/*describe('Controllers', () => {
    let mockApp: App;
    let controllers: Controllers;

    beforeEach(() => {
        mockApp = new App();
        controllers = new Controllers();
        controllers.start(mockApp);
    });

    test('addListeners adds event listeners correctly', () => {
        const loginBtn = document.createElement('button');
        loginBtn.id = 'login-btn';
        document.body.appendChild(loginBtn);

        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'logout-btn';
        document.body.appendChild(logoutBtn);

        const registrBtn = document.createElement('button');
        registrBtn.id = 'registration-btn';
        document.body.appendChild(registrBtn);

        const logoLink = document.createElement('a');
        logoLink.classList.add('navbar-brand');
        document.body.appendChild(logoLink);

        fetchMock.mockResponse(JSON.stringify({ data: 'some response data' }));

        controllers.addListeners();

        loginBtn.click();
        expect(mockApp.setCurrentPage).toHaveBeenCalledWith('login');

        logoutBtn.click();
        expect(mockApp.setAuthenticationStatus).toHaveBeenCalledWith(false);
        expect(mockApp.setCurrentPage).toHaveBeenCalledWith('login');
        expect(logoutBtn.classList.contains('hidden')).toBe(false);
        expect(loginBtn.classList.contains('hidden')).toBe(true);

        registrBtn.click();
        expect(mockApp.setCurrentPage).toHaveBeenCalledWith('registration');

        logoLink.click();
        expect(mockApp.setCurrentPage).toHaveBeenCalledWith('main');

        document.body.removeChild(loginBtn);
        document.body.removeChild(logoutBtn);
        document.body.removeChild(registrBtn);
        document.body.removeChild(logoLink);
    });
});*/
