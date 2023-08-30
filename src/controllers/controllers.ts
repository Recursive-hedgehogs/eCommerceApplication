import App from '../app/app';
import { ROUTE } from '../constants/enums/enum';
import { ApiRefreshTokenFlow } from '../api/api-flows/api-refresh-token-flow';
import SdkAuth from '@commercetools/sdk-auth';
import { environment } from '../environment/environment';
import { ApiExistingTokenFlow } from '../api/api-flows/api-existing-token-flow';
import { ITokenResponse } from '../constants/interfaces/response.interface';
import { MainPageController } from '../pages/main-page/main-page-controller';
import { Router } from '../router/router';
import { HeaderControllers } from '../components/header/headerControllers';
import { NotFoundPageController } from '../pages/not-found-page/not-found-page-controller';
import { LoginPageController } from '../pages/login-page/login-page-controller';
import { RegistrationPageController } from '../pages/registration-page/registration-page-controller';
import { CatalogPageController } from '../pages/catalog-page/catalog-page-controller';
import { ProductPageController } from '../pages/product-page/product-page-controller';

export class Controllers {
    private app: App | null;
    private apiRefreshTokenFlow: ApiRefreshTokenFlow;
    private apiExistingTokenFlow: ApiExistingTokenFlow;
    private router: Router;

    constructor() {
        this.app = null;
        this.apiRefreshTokenFlow = new ApiRefreshTokenFlow();
        this.apiExistingTokenFlow = new ApiExistingTokenFlow();
        this.router = new Router();
    }

    public start(app: App): void {
        this.app = app;
        new HeaderControllers();
        new MainPageController();
        new NotFoundPageController();
        new LoginPageController();
        new RegistrationPageController();
        new CatalogPageController();
        new ProductPageController();
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
                host: environment.authURL,
                projectKey: environment.projectKey,
                disableRefreshToken: false,
                credentials: {
                    clientId: environment.clientID,
                    clientSecret: environment.clientSecret,
                },
                scopes: [environment.scope],
                fetch,
            });
            authClient.refreshTokenFlow(refreshToken).then((resp: ITokenResponse): void => {
                this.apiExistingTokenFlow.setUserData(resp.access_token);
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
        }
        window.removeEventListener('load', this.onFirstLoad);
    };

    private redirectCallBack = (e: PopStateEvent): void => {
        const currentPath: string = window.location.pathname.slice(1);
        if (e.state && e.state.route) {
            this.router.navigate(currentPath, e.state.route === currentPath);
        }
    };
}

function getUser() {
    throw new Error('Function not implemented.');
}
