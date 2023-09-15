import { ApiAnonymousSessionFlow } from './api-flows/api-anonymous-session-flow';
import { ApiExistingTokenFlow } from './api-flows/api-existing-token-flow';

export class ApiBasket {
    private apiAnonymousSessionFlow: ApiAnonymousSessionFlow;
    private apiExistingTokenFlow: ApiExistingTokenFlow;

    constructor() {
        this.apiAnonymousSessionFlow = new ApiAnonymousSessionFlow();
        this.apiExistingTokenFlow = new ApiExistingTokenFlow();
    }

    public getCarts = () => {
        return this.apiAnonymousSessionFlow.apiRoot
            ?.carts()
            .get()
            .execute()
            .catch((err) => {
                throw Error(err);
            });
    };

    public createCart = () => {
        return this.apiAnonymousSessionFlow.apiRoot
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

    public createCartForLogInUser = () => {
        return this.apiExistingTokenFlow.apiRoot
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
        return this.apiAnonymousSessionFlow.apiRoot
            ?.carts()
            .withId({ ID: cartId })
            .post({
                body: {
                    version,
                    actions: [
                        {
                            action: 'addLineItem',
                            productId,
                            // variantId
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
        return this.apiAnonymousSessionFlow.apiRoot
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

    public getCartById = (ID: string) => {
        return this.apiAnonymousSessionFlow.apiRoot
            ?.carts()
            .withId({ ID })
            .get()
            .execute()
            .catch((err) => {
                throw Error(err);
            });
    };
}
