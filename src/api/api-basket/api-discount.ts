import { ApiAnonymousSessionFlow } from '../api-flows/api-anonymous-session-flow';
import { ApiExistingTokenFlow } from '../api-flows/api-existing-token-flow';
import { State } from '../../state/state';

export class ApiDiscount {
    private state: State = new State();
    private apiAnonymousSessionFlow: ApiAnonymousSessionFlow;
    private apiExistingTokenFlow: ApiExistingTokenFlow;

    constructor() {
        this.apiAnonymousSessionFlow = new ApiAnonymousSessionFlow();
        this.apiExistingTokenFlow = new ApiExistingTokenFlow();
    }

    get currentFlow(): ApiExistingTokenFlow | ApiAnonymousSessionFlow {
        return this.state.isLogIn ? this.apiExistingTokenFlow : this.apiAnonymousSessionFlow;
    }

    public getDiscountCodes = () => {
        return this.currentFlow.apiRoot
            ?.discountCodes()
            .get()
            .execute()
            .catch((err) => {
                throw Error(err);
            });
    };

    public getDiscountCodeById = (ID: string) => {
        return this.currentFlow.apiRoot
            ?.discountCodes()
            .withId({ ID })
            .get()
            .execute()
            .catch((err) => {
                throw Error(err);
            });
    };
}
