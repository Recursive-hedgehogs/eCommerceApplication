import { ApiExistingTokenFlow } from '../api-flows/api-existing-token-flow';
import { ApiAnonymousSessionFlow } from '../api-flows/api-anonymous-session-flow';
import { ClientResponse, ProductPagedQueryResponse } from '@commercetools/platform-sdk';
import { IProductFiltersCredentials } from '../../constants/interfaces/credentials.interface';

export class ApiProduct {
    private apiExistingTokenFlow: ApiExistingTokenFlow;
    private apiAnonymousSessionFlow: ApiAnonymousSessionFlow;

    constructor() {
        this.apiExistingTokenFlow = new ApiExistingTokenFlow();
        this.apiAnonymousSessionFlow = new ApiAnonymousSessionFlow();
    }

    public getProducts = () => {
        return this.apiAnonymousSessionFlow.apiRoot
            ?.products()
            .get()
            .execute()
            .then((el) => {
                return el as ClientResponse<ProductPagedQueryResponse>;
            })
            .catch((err) => {
                throw new Error(err);
            });
    };
    public getProductsFromApiExistingTokenFlow = () => {
        return this.apiExistingTokenFlow.apiRoot
            ?.products()
            .get()
            .execute()
            .catch((err) => {
                throw Error(err);
            });
    };

    public getProductById = (ID: string) => {
        return this.apiAnonymousSessionFlow.apiRoot
            ?.products()
            .withId({ ID })
            .get()
            .execute()
            .catch((err) => {
                throw Error(err);
            });
    };

    public getProductDiscountById = (ID: string) => {
        return this.apiAnonymousSessionFlow.apiRoot
            ?.productDiscounts()
            .withId({ ID })
            .get()
            .execute()
            .catch((err) => {
                throw Error(err);
            });
    };

    public getProductProjection = (data: IProductFiltersCredentials) => {
        return this.apiAnonymousSessionFlow.apiRoot
            ?.productProjections()
            .search()
            .get({
                queryArgs: {
                    staged: true,
                    filter: data.filter,
                    'text.en-US': data.search,
                    sort: data.sort,
                    fuzzy: true,
                    limit: 25,
                },
            })
            .execute()
            .catch((err) => {
                throw Error(err);
            });
    };

    public getCategories = () => {
        return this.apiAnonymousSessionFlow.apiRoot
            ?.categories()
            .get()
            .execute()
            .catch((err) => {
                throw Error(err);
            });
    };
}
