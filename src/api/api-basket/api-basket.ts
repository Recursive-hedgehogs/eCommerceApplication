import { ApiAnonymousSessionFlow } from '../api-flows/api-anonymous-session-flow';
import { ApiExistingTokenFlow } from '../api-flows/api-existing-token-flow';
import { State } from '../../state/state';
import { Cart, ClientResponse } from '@commercetools/platform-sdk';

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
            .then(({ body }: ClientResponse<Cart>) => {
                return body;
            })
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

    public changeCartItemQuantity(cartId: string, lineItemId: string, version: number, newQuantity: number) {
        return this.currentFlow.apiRoot
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
        return this.currentFlow.apiRoot
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

    public addDiscountCodeToCart = (cartId: string, version: number, code: string) => {
        return this.currentFlow.apiRoot
            ?.carts()
            .withId({ ID: cartId })
            .post({
                body: {
                    version,
                    actions: [
                        {
                            action: 'addDiscountCode',
                            code,
                        },
                    ],
                },
            })
            .execute()
            .catch((err) => {
                throw Error(err);
            });
    };

    public removeDiscountCodeFromCart = (cartId: string, version: number, discountCodeId: string) => {
        return this.currentFlow.apiRoot
            ?.carts()
            .withId({ ID: cartId })
            .post({
                body: {
                    version,
                    actions: [
                        {
                            action: 'removeDiscountCode',
                            discountCode: {
                                typeId: 'discount-code',
                                id: discountCodeId,
                            },
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
