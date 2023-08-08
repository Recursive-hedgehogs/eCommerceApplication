export interface IView {
    build(): void;
}
export interface IApp {
    view: IView | null;
    start(view: IView): void;
    buildView(): void;
}

export interface IElementParams {
    tag: string;
    classNames: Array<string>;
    textContent?: string;
    innerHTML?: string;
}
