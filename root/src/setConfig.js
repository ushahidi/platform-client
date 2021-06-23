import { getConfig } from "@ushahidi/api";

export const setPageMetadata = function () {
    getConfig("site").then((config) => {
        const siteTitle = config.name ? config.name : "USHAHIDI";
        document.title = siteTitle;
        let head = document.querySelector("head");
        //  TODO: check donations, apple, ga and intercom
        // Also, is there a way to add those variables without using vanilla js?
        if (config.description && config.description !== "") {
            let meta = document.createElement("meta");
            meta.name = "description";
            meta.content = config.description;
            head.appendChild(meta);
        }
    });
};
