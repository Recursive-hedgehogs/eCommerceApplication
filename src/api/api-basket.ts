import { ApiAnonymousSessionFlow } from './api-flows/api-anonymous-session-flow';
import { ApiExistingTokenFlow } from './api-flows/api-existing-token-flow';
import { State } from '../state/state';

export class ApiBasket {
    private state: State = new State();
    private readonly apiAnonymousSessionFlow: ApiAnonymousSessionFlow;
    private readonly apiExistingTokenFlow: ApiExistingTokenFlow;

    constructor() {
        this.apiAnonymousSessionFlow = new ApiAnonymousSessionFlow();
        this.apiExistingTokenFlow = new ApiExistingTokenFlow();
    }

    get currentFlow(): ApiExistingTokenFlow | ApiAnonymousSessionFlow {
        return this.state.isLogIn ? this.apiExistingTokenFlow : this.apiAnonymousSessionFlow;
    }

    public getCarts = () => {
        return this.currentFlow.apiRoot
            ?.carts()
            .get()
            .execute()
            .catch((err) => {
                throw Error(err);
            });
    };

    public getCartById = (ID: string) => {
        return this.currentFlow.apiRoot
            ?.carts()
            .withId({ ID })
            .get()
            .execute()
            .catch((err) => {
                throw Error(err);
            });
    };

    public createCart = () => {
        return this.currentFlow.apiRoot
            ?.carts()
            .post({
                body: { currency: 'EUR' },
            })
            .execute()
            .then(({ body }) => body)
            .catch((err) => {
                throw Error(err);
            });
    };

    public updateCart = (cartId: string, version: number, productId: string) => {
        return this.currentFlow.apiRoot
            ?.carts()
            .withId({ ID: cartId })
            .post({
                body: {
                    version,
                    actions: [
                        {
                            action: 'addLineItem',
                            productId,
                            quantity: 1,
                        },
                    ],
                },
            })
            .execute()
            .catch((err) => {
                throw Error(err);
            });
    };

    public deleteCart = (ID: string, version: number) => {
        return this.currentFlow.apiRoot
            ?.carts()
            .withId({ ID })
            .delete({
                queryArgs: {
                    version,
                },
            })
            .execute()
            .catch((err) => {
                throw Error(err);
            });
    };
}
