const { createProxyMiddleware } = require('http-proxy-middleware');

const { REACT_APP_API_ENDPOINT, REACT_APP_IS_USE_PROXY } = process.env;

module.exports = (app) => {
    if (REACT_APP_API_ENDPOINT && REACT_APP_IS_USE_PROXY) {
        app.use(createProxyMiddleware('/graphql', { target: REACT_APP_API_ENDPOINT, changeOrigin: true }));
        app.use(createProxyMiddleware('/files', { target: REACT_APP_API_ENDPOINT, changeOrigin: true }));
    }
};
