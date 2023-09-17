import { ApiAnonymousSessionFlow } from './api-flows/api-anonymous-session-flow';

export class ApiBasket {
    private apiAnonymousSessionFlow: ApiAnonymousSessionFlow;

    constructor() {
        this.apiAnonymousSessionFlow = new ApiAnonymousSessionFlow();
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

    public deleteItemInCart = (cartId: string, version: number, lineItemId: string) => {
        return this.apiAnonymousSessionFlow.apiRoot
            ?.carts()
            .withId({ ID: cartId })
            .post({
                body: {
                    version,
                    actions: [
                        {
                            action: 'removeLineItem',
                            lineItemId,
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

    public changeCartItemQuantity(cartId: string, lineItemId: string, version: number, newQuantity: number) {
        return this.apiAnonymousSessionFlow.apiRoot
            ?.carts()
            .withId({ ID: cartId })
            .post({
                body: {
                    version,
                    actions: [
                        {
                            action: 'changeLineItemQuantity',
                            lineItemId,
                            quantity: newQuantity,
                        },
                    ],
                },
            })
            .execute()
            .catch((error) => {
                throw Error(error);
            });
    }

    public removeCartItem = (cartId: string, lineItemId: string, version: number) => {
        return this.apiAnonymousSessionFlow.apiRoot
            ?.carts()
            .withId({ ID: cartId })
            .post({
                body: {
                    version,
                    actions: [
                        {
                            action: 'removeLineItem',
                            lineItemId,
                        },
                    ],
                },
            })
            .execute()
            .catch((err) => {
                throw Error(err);
            });
    };
}
