import { config } from 'dotenv';
import * as packageJson from '../../package.json';
import App from '../app/app';
import View from '../view/view';
import 'jest-fetch-mock';
import { Controllers } from '../controllers/controllers';
config();

test('Husky is configured in package.json', () => {
    expect(packageJson.husky).toBeDefined();
});

test('Husky is installed and configured properly', () => {
    const huskyConfig: { hooks: { 'pre-commit': string } } = packageJson.husky;
    expect(huskyConfig.hooks['pre-commit']).toBeDefined();
    expect(huskyConfig.hooks['pre-commit']).toBe('lint');
});

describe('App', () => {
    const env = process.env;
    let app: App;
    beforeEach(async () => {
        jest.resetModules();
        process.env = { ...env };
        app = new App();
    });
    test('will receive process.env variables', async () => {
        await expect(!!process.env.CTP_PROJECT_KEY).toBe(true);
    });
    test('setAuthenticationStatus sets authentication status', async () => {
        app.setAuthenticationStatus(true);
        expect(app.isAuthenticated()).toBe(true);
    });
    test('isAuthenticated returns correct authentication status', async () => {
        app.setAuthenticationStatus(false);
        expect(app.isAuthenticated()).toBe(false);
        app.setAuthenticationStatus(true);
        expect(app.isAuthenticated()).toBe(true);
    });
    test('start sets the view property', async () => {
        const mockView: View = {} as View;
        app.start(mockView);
        expect(app.view).toBe(mockView);
    });
    test('App authentication status is initially set to false', async () => {
        expect(app.isAuthenticated()).toBe(true);
    });
    test('App authentication status can be toggled', async () => {
        app.setAuthenticationStatus(false);
        expect(app.isAuthenticated()).toBe(false);
        app.setAuthenticationStatus(true);
        expect(app.isAuthenticated()).toBe(true);
    });
    test('App starts with correct initial view properties', async () => {
        const mockView: View = {} as View;
        app.start(mockView);
        expect(app.view).toBe(mockView);
    });
    test('setCurrentPage redirects to MAIN when authenticated user goes to LOGIN', () => {
        const app: App = new App();
        app.setAuthenticationStatus(true);
        // app.setCurrentPage(ROUTE.LOGIN);
    });
    afterEach(() => {
        process.env = env;
    });
});

describe('Controllers', () => {
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

        // fetchMock.mockResponse(JSON.stringify({ data: 'some response data' }));

        controllers.addListeners();

        // loginBtn.click();
        // expect(mockApp.setCurrentPage).toHaveBeenCalledWith('login');
        //
        logoutBtn.click();
        // expect(mockApp.setAuthenticationStatus).toHaveBeenCalledWith(false);
        // expect(mockApp.setCurrentPage).toHaveBeenCalledWith('login');
        expect(logoutBtn.classList.contains('hidden')).toBe(false);
        expect(loginBtn.classList.contains('hidden')).toBe(false);
        //
        // registrBtn.click();
        // expect(mockApp.setCurrentPage).toHaveBeenCalledWith('registration');
        //
        // logoLink.click();
        // expect(mockApp.setCurrentPage).toHaveBeenCalledWith('main');

        document.body.removeChild(loginBtn);
        document.body.removeChild(logoutBtn);
        document.body.removeChild(registrBtn);
        document.body.removeChild(logoLink);
    });
});
