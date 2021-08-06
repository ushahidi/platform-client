import { getConfig } from "@ushahidi/api";

let backendUrl = "";
// window.ushahidi.backendUrl is configured in ./root/src/config.js
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

export const getPageMetadata = function () {
    return getConfig("site").then((config) => {
          return {
            title: config.name || "USHAHIDI",
            description: config.description || "",
            appleId: getAppleId(),
            monitization: ""
        }
    });
};

const getAppleId = function() {
    if(window.ushahidi && window.ushahidi.appStoreId) {
        return window.ushahidi.appStoreId;
    }
    return;
}

