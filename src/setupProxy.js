const { createProxyMiddleware } = require('http-proxy-middleware');

const { REACT_APP_API_ENDPOINT } = process.env;

module.exports = (app) => {
    app.use(createProxyMiddleware('/graphql', { target: REACT_APP_API_ENDPOINT, changeOrigin: true }));
    app.use(createProxyMiddleware('/files', { target: REACT_APP_API_ENDPOINT, changeOrigin: true }));
};
