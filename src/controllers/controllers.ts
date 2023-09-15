import App from '../app/app';
import { ROUTE } from '../constants/enums/enum';
import { ApiRefreshTokenFlow } from '../api/api-flows/api-refresh-token-flow';
import SdkAuth from '@commercetools/sdk-auth';
import { ApiExistingTokenFlow } from '../api/api-flows/api-existing-token-flow';
import { ITokenResponse } from '../constants/interfaces/response.interface';
import { Router } from '../router/router';
import { HeaderControllers } from '../components/header/headerControllers';
import { NotFoundPageController } from '../pages/not-found-page/not-found-page-controller';
import { LoginPageController } from '../pages/login-page/login-page-controller';
import { RegistrationPageController } from '../pages/registration-page/registration-page-controller';
import { CatalogPageController } from '../pages/catalog-page/catalog-page-controller';
import { UserPageController } from '../pages/user-page/user-page-controller';
import { Cart } from '@commercetools/platform-sdk';

export class Controllers {
    private app: App | null;
    private apiRefreshTokenFlow: ApiRefreshTokenFlow;
    private apiExistingTokenFlow: ApiExistingTokenFlow;
    private router: Router;
    userPageControllers: UserPageController;

    constructor() {
        this.app = null;
        this.apiRefreshTokenFlow = new ApiRefreshTokenFlow();
        this.apiExistingTokenFlow = new ApiExistingTokenFlow();
        this.userPageControllers = new UserPageController();
        this.router = new Router();
    }

    public start(app: App): void {
        this.app = app;
        new HeaderControllers();
        new NotFoundPageController();
        new LoginPageController();
        new RegistrationPageController();
        new CatalogPageController();
        this.addListeners();
    }

    public addListeners(): void {
        window.addEventListener('load', this.onFirstLoad);
        window.addEventListener('popstate', this.redirectCallBack);
    }

    private onFirstLoad = (): void => {
        const currentLocation: string = window.location.pathname.slice(1) ? window.location.pathname.slice(1) : 'main';
        this.router.navigate(currentLocation);
        const refreshToken: string | null = localStorage.getItem('refreshToken');
        if (refreshToken) {
            const authClient = new SdkAuth({
                host: process.env.CTP_AUTH_URL,
                projectKey: process.env.CTP_PROJECT_KEY,
                disableRefreshToken: false,
                credentials: {
                    clientId: process.env.CTP_CLIENT_ID,
                    clientSecret: process.env.CTP_CLIENT_SECRET,
                },
                scopes: [process.env.CTP_SCOPES],
                fetch,
            });
            authClient.refreshTokenFlow(refreshToken).then((resp: ITokenResponse): void => {
                this.apiExistingTokenFlow.setUserData(resp.access_token);
                const scopes: string[] = resp.scope.split(' ');
                const customerIdScope: string | undefined = scopes.find((scope: string) =>
                    scope.startsWith('customer_id:')
                );
                const customerId: string | null = customerIdScope ? customerIdScope.split(':')[1] : null;
                if (customerId) {
                    this.app?.userPage.setUserData(customerId, () => {
                        this.app?.userPage.showUserData();
                        this.userPageControllers.addListenersToAddresses();
                    });
                }
                this.app?.setAuthenticationStatus(true); // set authentication state
                if (window.location.pathname.slice(1) === ROUTE.LOGIN) {
                    this.router.navigate(ROUTE.MAIN); //add redirection from login to MAIN page
                }
                const loginBtn: HTMLElement | null = document.getElementById('login-btn');
                const logoutBtn: HTMLElement | null = document.getElementById('logout-btn');
                const profileBtn: HTMLElement | null = document.getElementById('profile-btn');
                const registrBtn: HTMLElement | null = document.getElementById('registration-btn');
                logoutBtn?.classList.remove('hidden');
                profileBtn?.classList.remove('hidden');
                loginBtn?.classList.add('hidden');
                registrBtn?.classList.add('hidden');
            });
            this.apiRefreshTokenFlow.setUserData(refreshToken);
            // this.apiRefreshTokenFlow.apiRoot
            //     ?.get()
            //     .execute()
            // .then((resp: ClientResponse<Project>): void => {
            // if (resp.headers) {
            //     const headers: { Authorization: string } = resp.headers as { Authorization: string };
            //     this.apiExistingTokenFlow.setUserData(headers.Authorization);
            //     this.app?.showMessage('You are logged in');
            //     this.app?.setAuthenticationStatus(true); // set authentication state
            //     this.app?.setCurrentPage(ROUTE.MAIN); //add redirection to MAIN page
            //     const loginBtn: HTMLElement | null = document.getElementById('login-btn');
            //     const logoutBtn: HTMLElement | null = document.getElementById('logout-btn');
            //     logoutBtn?.classList.remove('hidden');
            //     loginBtn?.classList.add('hidden');
            // }
            // })
            // .catch((err) => {
            //     throw Error(err);
            // });
        } else if (window.location.pathname.slice(1) === ROUTE.USER) {
            this.router.navigate(ROUTE.LOGIN); //add redirection from user to LOGIN page
        }
        this.setBasket();
        window.removeEventListener('load', this.onFirstLoad);
    };

    private redirectCallBack = (e: PopStateEvent): void => {
        const currentPath: string = window.location.pathname.slice(1);
        if (e.state && e.state.route) {
            this.router.navigate(currentPath, e.state.route === currentPath);
        }
    };

    private setBasket(): void {
        this.app?.basketPage.getBasket()?.then((cart) => {
            if (cart?.lineItems) {
                this.app?.header.setItemsNumInBasket(cart?.lineItems.length);
                this.app?.basketPage.setContent(cart);
                const idArray = cart.lineItems.map(({ productId }) => productId);
                this.app?.catalogPage.updateCardsButtonAddToCart(idArray);
            }
        });
    }
}
