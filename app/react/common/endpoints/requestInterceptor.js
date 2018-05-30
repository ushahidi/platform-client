import Session from "common/auth/session.service.js";

const shouldIgnoreAuthError = config => {
    // eslint doesn't allow for reassign params
    // so we make a simple copy
    const configCopy = config;
    let isIgnorable = false;
    if (configCopy.params !== undefined && configCopy.params.ignore403) {
        delete configCopy.params.ignore403;
        isIgnorable = true;
    }
    let i = 0;
    const matchers = [
        "/oauth/token(/|$)",
        "/users(/|$)([0-9]+|$)",
        "/roles(/|$)"
    ];
    while (isIgnorable === false && i < matchers.length) {
        isIgnorable = !!configCopy.url.match(matchers[i]);
        i += 1;
    }
    return isIgnorable;
};

export default function(instance) {
    instance.interceptors.request.use(
        config => {
            const configCopy = config;
            // let's replace window.ushahidi
            const apiUrl = `${window.ushahidi.backendUrl.replace(
                /\/$/,
                ""
            )}/api/v3`;
            configCopy.ignorable = shouldIgnoreAuthError(configCopy);

            if (configCopy.url.indexOf(apiUrl) === -1) {
                return configCopy;
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
                // and resolve the promise for the configCopy hash
                configCopy.headers.Authorization = `Bearer ${accessToken}`;
            }

            return configCopy;
        },
        error =>
            // Do something with request error
            Promise.reject(error)
    );
}
