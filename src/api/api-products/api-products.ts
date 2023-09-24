import { ApiAnonymousSessionFlow } from '../api-flows/api-anonymous-session-flow';
import { IProductFiltersCredentials } from '../../constants/interfaces/credentials.interface';

export class ApiProduct {
    private apiAnonymousSessionFlow: ApiAnonymousSessionFlow;

    constructor() {
        this.apiAnonymousSessionFlow = new ApiAnonymousSessionFlow();
    }

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
    public getProductProjection = (data: IProductFiltersCredentials, offset?: number) => {
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
                    offset,
                    limit: 20,
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
