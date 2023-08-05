import { resolve } from 'path';

export const mode = 'development';
export const devtool = 'inline-source-map';
export const devServer = {
    contentBase: resolve(__dirname, '../eCommerceApplication'),
    hot: true,
    liveReload: true,
};
