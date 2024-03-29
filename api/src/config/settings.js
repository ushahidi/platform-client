export const getBackendUrl = function () {
    let backendUrl = "";
    // window.ushahidi.backendUrl is configured in ./root/src/config.js
    // BACKEND_URL is set on build-time with Webpack from environment variables
    if (window.ushahidi && window.ushahidi.backendUrl) {
        backendUrl = window.ushahidi.backendUrl;
    } else {
        backendUrl = BACKEND_URL;
    }

    // REGEX to format the url correctly
    return backendUrl.replace(/\/$/, "");
};
