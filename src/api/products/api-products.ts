import { ApiPasswordFlow } from '../api-password-flow';
import { ApiRefreshTokenFlow } from '../api-refresh-token-flow';
import { ApiExistingTokenFlow } from '../api-existing-token-flow';

class ApiProduct {
    private apiPasswordFlow: ApiPasswordFlow;
    private apiRefreshTokenFlow: ApiRefreshTokenFlow;
    private apiExistingTokenFlow: ApiExistingTokenFlow;

    constructor() {
        this.apiPasswordFlow = new ApiPasswordFlow();
        this.apiRefreshTokenFlow = new ApiRefreshTokenFlow();
        this.apiExistingTokenFlow = new ApiExistingTokenFlow();
    }

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
}
