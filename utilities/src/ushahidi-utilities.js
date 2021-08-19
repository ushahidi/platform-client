import { getConfig } from "@ushahidi/api";

export const getPageMetadata = function () {
    return getConfig("site").then((config) => {
          return {
            title: config.name || "USHAHIDI",
            description: config.description || "",
            appleId: getAppleId()
        }
    });
};

const getAppleId = function() {
    if(window.ushahidi && window.ushahidi.appStoreId) {
        return window.ushahidi.appStoreId;
    }
    return;
}
