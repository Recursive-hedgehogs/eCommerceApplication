export class State {
    private static singleton: State;
    public isLogIn = false;
    public basketId = '';

    constructor() {
        return State.singleton ?? (State.singleton = this);
    }
}
