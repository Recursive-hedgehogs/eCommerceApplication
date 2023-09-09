import { ApiAnonymousSessionFlow } from './api-flows/api-anonymous-session-flow';
import { CartDraft, ShoppingListUpdate } from '@commercetools/platform-sdk';
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

    public getShoppingListByID = (ID: string) => {
        return this.apiAnonymousSessionFlow.apiRoot
            ?.shoppingLists()
            .withId({ ID })
            .get()
            .execute()
            .catch((err) => {
                throw Error(err);
            });
    };

    public updateShoppingListByID = (data: ShoppingListUpdate, ID: string) => {
        return this.apiAnonymousSessionFlow.apiRoot
            ?.shoppingLists()
            .withId({ ID })
            .post({
                body: data,
            })
            .execute()
            .catch((err) => {
                throw Error(err);
            });
    };
}
