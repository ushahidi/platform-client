// possibly consider moving this to its own function and trigger in root-config?

let backendUrl = "";
// window.ushahidi.backendUrl is configured in ./rootconfig/src/config.js
// BACKEND_URL is set on build-time with Webpack from environment variables
if (window.ushahidi && window.ushahidi.backendUrl) {
    backendUrl = window.ushahidi.backendUrl;
} else {
    backendUrl = BACKEND_URL;
}

export const getBackendUrl = function () {
    // REGEX to format the url correctly
    return backendUrl.replace(/\/$/, "");
};
