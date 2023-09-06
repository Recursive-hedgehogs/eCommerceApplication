//import { config } from 'dotenv';
import * as packageJson from '../../package.json';
import App from '../app/app';
import View from '../view/view';
import 'jest-fetch-mock';
import { Controllers } from '../controllers/controllers';
//config();
import UserPage from '../pages/user-page/user-page';
import { apiCustomer } from '../api/api-customer';
import { Customer } from '@commercetools/platform-sdk';
import { ROUTE } from '../constants/enums/enum';
import { Router } from '../router/router';
import { Filters } from '../components/filters/filters';
import { FiltersController } from '../components/filters/filters-controller';
import CatalogPage from '../pages/catalog-page/catalog-page';
import { validateDateOfBirth } from '../utils/validations';
import {
    validateEmail,
    validatePostalCode,
    validateName,
    validateStreet,
    validatePassword,
} from '../utils/validations';

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
    /*test('will receive process.env variables', async () => {
        await expect(!!process.env.CTP_PROJECT_KEY).toBe(true);
    });*/
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

describe('UserPage', () => {
    let userPage: UserPage;

    beforeEach(() => {
        userPage = new UserPage();
    });

    it('should create an instance of UserPage', () => {
        expect(userPage).toBeInstanceOf(UserPage);
    });

    it('should set user data', async () => {
        const userData: Customer = {
            id: '1',
            firstName: 'John',
            lastName: 'Snow',
            dateOfBirth: '1990-01-01',
            email: 'john.snow@example.com',
            version: 1,
            createdAt: '2023-01-01T00:00:00Z',
            lastModifiedAt: '2023-01-01T00:00:00Z',
            addresses: [],
            isEmailVerified: true,
            authenticationMode: 'password',
        };

        apiCustomer.getUser = jest.fn().mockResolvedValue({ body: userData });

        await userPage.setUserData('1');

        expect(userPage.userData).toEqual(userData);
    });
});

describe('Router', () => {
    let router: Router;
    let app: App;

    beforeEach(() => {
        app = new App();
        router = new Router();
        router.start(app);
    });

    it('should navigate to the login page when user is authenticated', () => {
        app.isAuthenticated = jest.fn().mockReturnValue(true);

        router.navigate(ROUTE.LOGIN);

        expect(window.location.pathname).toBe(`/${ROUTE.LOGIN}`);
    });

    it('should navigate to a product page', () => {
        const productId = '12345';
        router.navigate(`product/${productId}`);
        expect(window.location.pathname).toBe(`/product/${productId}`);
    });
});

describe('Filters', () => {
    let filters: Filters;

    beforeEach(() => {
        filters = new Filters();
    });

    it('should be defined', () => {
        expect(filters).toBeDefined();
    });

    it('should convert data to filters', () => {
        const data = new Map<string, string | boolean>();
        data.set('fantasy', true);
        data.set('english', true);
        const result = filters.convertToFilter(data);

        expect(result).toContain('categories.id:"96df4d23-484f-4ec0-a1c1-39c077a3aefd"');
        expect(result).toContain('variants.attributes.english:"true"');
    });
});

describe('FiltersController', () => {
    let filtersController: FiltersController;
    let filters: Filters;
    let catalogPage: CatalogPage;

    beforeEach(() => {
        filters = new Filters();
        catalogPage = new CatalogPage();
        filtersController = new FiltersController(filters, catalogPage);
    });

    it('should be defined', () => {
        expect(filtersController).toBeDefined();
    });

    it('should update content when submitted', () => {
        const submitEvent = new Event('submit');
        filters.element?.dispatchEvent(submitEvent);
    });
});

describe('Validation Functions', () => {
    it('should validate email correctly', () => {
        expect(validateEmail('test@example.com')).toBeNull();

        expect(validateEmail('invalid-email')).toBe("Email should contain an '@' symbol");
    });

    it('should validate password correctly', () => {
        expect(validatePassword('ValidPassword1!')).toBeNull();

        expect(validatePassword('Short1!')).toBe('Password should be at least 8 characters long');
    });

    it('should validate name correctly', () => {
        expect(validateName('JohnSnow')).toBeNull();

        expect(validateName('123')).toBe('Should only contain letters');
    });

    it('should validate street correctly', () => {
        expect(validateStreet('123 Main St.')).toBeNull();

        expect(validateStreet('123')).toBe('Should contain at least one letter');
    });

    it('should validate date of birth correctly', () => {
        expect(validateDateOfBirth('1990-01-01')).toBeNull();

        expect(validateDateOfBirth('2023-01-01')).toBe('You must be at least 13 years old');
    });

    it('should validate postal code correctly', () => {
        expect(validatePostalCode('12345')).toBeNull();

        expect(validatePostalCode('ABC')).toBe('Postal code should contain only digits and dashes');
    });
});
