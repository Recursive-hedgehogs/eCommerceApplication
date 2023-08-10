import fetch from 'node-fetch';
import {
    ClientBuilder,
    Client,
    type AuthMiddlewareOptions,
    type HttpMiddlewareOptions
} from '@commercetools/sdk-client-v2';

// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
    host: 'https://auth.europe-west1.gcp.commercetools.com',
    projectKey: 'ecommerce-shop',
    credentials: {
        clientId: 'j2TAwgaFyEJ2HSjLAAYGG6gs',
        clientSecret: '3FwAP1_gsgnXTshyM090BBlNOrJ-sFzS',
    },
    scopes: [
        'view_published_products:ecommerce-shop manage_my_shopping_lists:ecommerce-shop manage_my_business_units:ecommerce-shop manage_my_payments:ecommerce-shop manage_my_quotes:ecommerce-shop manage_my_orders:ecommerce-shop manage_my_quote_requests:ecommerce-shop create_anonymous_token:ecommerce-shop view_products:ecommerce-shop view_categories:ecommerce-shop manage_my_profile:ecommerce-shop',
    ],
    fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
    host: 'https://api.europe-west1.gcp.commercetools.com',
    fetch,
};

// Export the ClientBuilder
export const ctpClient: Client = new ClientBuilder()
    .withClientCredentialsFlow(authMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();
