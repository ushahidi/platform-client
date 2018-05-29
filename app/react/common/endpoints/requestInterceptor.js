import Session from "common/auth/session.service.js";

const shouldIgnoreAuthError = config => {
    const thisConfig = config;
    let isIgnorable = false;
    if (thisConfig.params !== undefined && thisConfig.params.ignore403) {
        delete thisConfig.params.ignore403;
        isIgnorable = true;
    }
    let i = 0;
    const matchers = [
        "/oauth/token(/|$)",
        "/users(/|$)([0-9]+|$)",
        "/roles(/|$)"
    ];
    while (isIgnorable === false && i < matchers.length) {
        isIgnorable = !!thisConfig.url.match(matchers[i]);
        i += 1;
    }
    return isIgnorable;
};

export default function(instance) {
    instance.interceptors.request.use(
        config => {
            const thisConfig = config;
            // let's replace window.ushahidi
            const apiUrl = `${window.ushahidi.backendUrl.replace(
                /\/$/,
                ""
            )}/api/v3`;
            thisConfig.ignorable = shouldIgnoreAuthError(thisConfig);

            if (thisConfig.url.indexOf(apiUrl) === -1) {
                return thisConfig;
            }

            const accessToken = Session.getSessionDataEntry("accessToken");
            const accessTokenExpires = Session.getSessionDataEntry(
                "accessTokenExpires"
            );
            const now = Math.floor(Date.now() / 1000);

            if (
                accessToken !== undefined &&
                accessToken !== null &&
                accessTokenExpires > now
            ) {
                // if we already have a valid accessToken,
                // we will set it straight ahead
                // and resolve the promise for the thisConfig hash
                thisConfig.headers.Authorization = `Bearer ${accessToken}`;
            }

            return thisConfig;
        },
        error =>
            // Do something with request error
            Promise.reject(error)
    );
}
