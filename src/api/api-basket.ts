import { ApiAnonymousSessionFlow } from './api-flows/api-anonymous-session-flow';
import { CartDraft } from '@commercetools/platform-sdk';

export class ApiBasket {
    private apiAnonymousSessionFlow: ApiAnonymousSessionFlow;

    constructor() {
        this.apiAnonymousSessionFlow = new ApiAnonymousSessionFlow();
    }

    public createCart = (data: CartDraft) => {
        return this.apiAnonymousSessionFlow.apiRoot
            ?.carts()
            .post({
                body: data,
            })
            .execute()
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
