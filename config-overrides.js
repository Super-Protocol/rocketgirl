const {
    override,
    addWebpackResolve,
    // addBundleVisualizer,
    addWebpackPlugin,
    addWebpackModuleRule,
} = require('customize-cra');
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');

module.exports = override(
    addWebpackResolve({
        alias: { '@': path.resolve(__dirname, 'src') },
    }),
    // process.env.BUNDLE_VISUALIZE === '1' && addBundleVisualizer(),
    addWebpackPlugin(new HTMLWebpackPlugin({
        template: './public/index.html',
        inject: 'body',
    })),
    addWebpackPlugin(new InterpolateHtmlPlugin({
        PUBLIC_URL: '',
    })),
    addWebpackModuleRule({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
    }),
);
