import { getConfig } from "@ushahidi/api";
import svg from "ushahidi-platform-pattern-library/assets/img/iconic-sprite.svg";
import fonts from "ushahidi-platform-pattern-library/assets/fonts/Lato/css/fonts.css";

export const getSvgSprite = function () {
    return svg;
}

export const getFonts = function () {
    return fonts;
}

export const getPageMetadata = function () {
    return getConfig("site").then((config) => {
        return {
            title: config.name || "USHAHIDI",
            description: config.description || "",
            appleId: getAppleId(),
        };
    });
};

export const setBootstrapConfig = function () {
    if (window.ushahidi && window.ushahidi.backendUrl && !window.ushahidi.bootstrapConfig) {
        getConfig()
        .then(response => {
            return response.json();
        })
        .then(config => {
            // setting config
            window.ushahidi.bootstrapConfig = config;
        })
        .catch(err => {
            window.ushahidi.bootstrapConfig = {};
        });
    }
}

const getAppleId = function () {
    if (window.ushahidi && window.ushahidi.appStoreId) {
        return window.ushahidi.appStoreId;
    }
    return;
};
