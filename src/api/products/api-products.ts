import { ApiExistingTokenFlow } from '../api-existing-token-flow';

export class ApiProduct {
    private apiExistingTokenFlow: ApiExistingTokenFlow;

    constructor() {
        this.apiExistingTokenFlow = new ApiExistingTokenFlow();
    }

    public getProducts = () => {
        return this.apiExistingTokenFlow.apiRoot
            ?.products()
            .get()
            .execute()
            .catch((err) => {
                throw Error(err);
            });
    };
    public getProductByKey = (key: string) => {
        return this.apiExistingTokenFlow.apiRoot
            ?.products()
            .withKey({ key })
            .get()
            .execute()
            .catch((err) => {
                throw Error(err);
            });
    };

    public getProductById = (ID: string) => {
        return this.apiExistingTokenFlow.apiRoot
            ?.products()
            .withId({ ID })
            .get()
            .execute()
            .catch((err) => {
                throw Error(err);
            });
    };

    public getProductDiscountById = (ID: string) => {
        return this.apiExistingTokenFlow.apiRoot
            ?.productDiscounts()
            .withId({ ID })
            .get()
            .execute()
            .catch((err) => {
                throw Error(err);
            });
    };

    public getProductDiscounts = () => {
        return this.apiExistingTokenFlow.apiRoot
            ?.productDiscounts()
            .get()
            .execute()
            .catch((err) => {
                throw Error(err);
            });
    };
}
