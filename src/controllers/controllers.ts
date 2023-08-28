import App from '../app/app';
import { ROUTE } from '../constants/enums/enum';
import { ApiRefreshTokenFlow } from '../api/api-refresh-token-flow';
import SdkAuth from '@commercetools/sdk-auth';
import { environment } from '../environment/environment';
import { ApiExistingTokenFlow } from '../api/api-existing-token-flow';
import { ITokenResponse } from '../constants/interfaces/response.interface';
import { MainPageControllers } from '../pages/main-page/main-page-controllers';
import { Router } from '../router/router';
import { NotFoundPageControllers } from '../pages/not-found-page/not-found-page-controllers';
import { LoginPageControllers } from '../pages/login-page/login-page-controllers';
import { RegistrationPageControllers } from '../pages/registration-page/registration-page-controllers';

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
        new MainPageControllers();
        new NotFoundPageControllers();
        new LoginPageControllers();
        new RegistrationPageControllers();
        this.addListeners();
    }

    public addListeners(): void {
        window.addEventListener('load', this.onFirstLoad);
        window.addEventListener('popstate', this.redirectCallBack);

        const loginBtn: HTMLElement | null = document.getElementById('login-btn');
        const logoutBtn: HTMLElement | null = document.getElementById('logout-btn');
        const registrBtn: HTMLElement | null = document.getElementById('registration-btn');
        const logoLink: HTMLElement | null = document.querySelector('.navbar-brand');
        loginBtn?.addEventListener('click', (): void => {
            if (this.app?.isAuthenticated()) {
                this.router.navigate(ROUTE.MAIN); //redirecting to the Main page, if user is authenticated
            } else {
                this.router.navigate(ROUTE.LOGIN); // else to the login page
            }
            this.router.navigate(ROUTE.LOGIN);
        });
        logoutBtn?.addEventListener('click', (): void => {
            this.app?.setAuthenticationStatus(false); // set authentication state
            this.router.navigate(ROUTE.LOGIN); // else to the login page
            logoutBtn.classList.add('hidden');
            loginBtn?.classList.remove('hidden');
            localStorage.removeItem('refreshToken');
        });
        registrBtn?.addEventListener('click', (): void => {
            this.router.navigate(ROUTE.REGISTRATION);
        });
        logoLink?.addEventListener('click', (e: MouseEvent): void => {
            e.preventDefault();
            this.router.navigate(ROUTE.MAIN);
        });
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
                logoutBtn?.classList.remove('hidden');
                loginBtn?.classList.add('hidden');
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
