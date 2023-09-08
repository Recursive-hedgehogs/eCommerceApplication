export enum ROUTE {
    MAIN = 'main',
    LOGIN = 'login',
    REGISTRATION = 'registration',
    CATALOG = 'catalog',
    PRODUCT = 'product',
    USER = 'user',
    BASKET = 'basket',
    ABOUT = 'about',
    NOT_FOUND = 'not-found',
}

// export enum SORT {
//     NAME_ASC = 'name.en-US asc',
//     NAME_DESC = 'name.en-US desc',
//     PRICE_ASC = 'price asc',
//     PRICE_DESC = 'price desc',
// }

export const SORT: { [key: string]: string } = {
    NAME_ASC: 'name.en-US asc',
    NAME_DESC: 'name.en-US desc',
    PRICE_ASC: 'price asc',
    PRICE_DESC: 'price desc',
};
