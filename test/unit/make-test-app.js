/* eslint-disable */
import Util from "app/common/services/util.js";

window.ushahidi = {};

module.exports = function() {
    const appModule = angular.module("testApp", ["ushahidi.mock"]);
    // for the test app, we will mock the backend, so this url is actually never really used
    let backendUrl = (window.ushahidi.backendUrl = "http://backend"),
        claimedAnonymousScopes = [
            "posts",
            "media",
            "forms",
            "api",
            "tags",
            "sets",
            "users",
            "stats",
            "layers",
            "config",
            "messages"
        ];

    appModule
        .factory("_", $window => require("underscore/underscore"))
        .factory("Sortable", () => require("sortablejs"))
        .constant("CONST", {
            BACKEND_URL: backendUrl,
            API_URL: `${backendUrl}/api/v3`,
            OAUTH_CLIENT_ID: "ushahidiui",
            OAUTH_CLIENT_SECRET: "35e7f0bca957836d05ca0492211b0ac707671261",
            CLAIMED_ANONYMOUS_SCOPES: claimedAnonymousScopes,
            CLAIMED_USER_SCOPES: claimedAnonymousScopes.concat("dataproviders"),
            TOS_RELEASE_DATE: new Date("2017-08-04T14:32:22Z")
        })
        .service("Util", () => Util);

    return appModule;
};
/* eslint-enable */
