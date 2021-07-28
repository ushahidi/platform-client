require("dotenv-flow").config();
const path = require("path");
var express = require("express");
var { createProxyMiddleware } = require("http-proxy-middleware");

var app = express();

const PROXY_PORT = 9090;
const API_PORT = 9093;
const UTILITIES_PORT = 9094;
const LEGACY_PORT = 3000;
const ROOT_PORT = 9091;

// Proxy to the single-spa api module.
app.use(
    createProxyMiddleware("/ushahidi-api.js", {
        target: `http://localhost:${API_PORT}/`,
    })
);

// Proxy to the single-spa utilities module.
app.use(
    createProxyMiddleware("/ushahidi-utilities.js", {
        target: `http://localhost:${UTILITIES_PORT}/`,
    })
);

// Proxy endpoints to the Legacy angularjs client.
app.use(
    createProxyMiddleware(
        [
            "/locales",
            "/ushahidi-legacy-app.js",
            "/0.ushahidi-legacy-app.js",
            "/1.ushahidi-legacy-app.js",
            "/data.js",
            "/posts",
            "/activity.js",
            "/settings.js"
        ],
        {
            target: `http://localhost:${LEGACY_PORT}/`,
        }
    )
);

// Proxy the WebSocket API endpoint to the Legacy.
app.use(
    createProxyMiddleware(`/ws`, {
        target: `ws://localhost:${LEGACY_PORT}/`,
        ws: true,
    })
);

// Stop the Angularjs HMR from timing out.
app.use(
    createProxyMiddleware([
        "/sockjs-node",
        "/sockjs-node/info"
    ], {
        target: `ws://localhost:${LEGACY_PORT}/`,
        ws: true,
        onProxyReq: (proxyReq, req, res) => {
            // Return a 404 instead of letting the browser time out or receive
            // invalid data.
            res.status(404).send();
        },
    })
);

// Proxy the HMR endpoint to the Angularjs client.
app.use(
    createProxyMiddleware("/sockjs-legacy", {
        target: `http://localhost:${LEGACY_PORT}/`,
        ws: true,
    })
);

// Proxy to the single-spa root app.
app.use(
    createProxyMiddleware("/", {
        target: `http://localhost:${ROOT_PORT}/`,
    })
);

app.listen(PROXY_PORT);

console.log(`Serving on port ${PROXY_PORT}`);
