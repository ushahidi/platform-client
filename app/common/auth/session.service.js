const { localStorage } = window;

const clearedSessionData = {
    userId: undefined,
    realname: undefined,
    email: undefined,
    accessToken: undefined,
    accessTokenExpires: undefined,
    grantType: undefined,
    role: undefined,
    permissions: undefined,
    gravatar: undefined,
    language: undefined
};

class Session {
    constructor() {
        // Session is a singleton
        // Checking to see if it's already been instantiated
        if (!Session.instance) {
            this.sessionData = this.loadSessionData();
            Session.instance = this;
        }

        return Session.instance;
    }

    loadSessionData() {
        // use .map instead of forEach
        const newSessionData = Object.assign({}, clearedSessionData);
        Object.keys(newSessionData).forEach(key => {
            newSessionData[key] = localStorage.getItem(key);
        });
        return newSessionData;
    }

    setSessionDataEntries(entries) {
        Object.keys(entries).forEach(key => {
            localStorage.setItem(key, entries[key]);
        });
        const newSessionData = Object.assign({}, this.sessionData, entries);
        this.sessionData = newSessionData;
    }

    setSessionDataEntry(key, value) {
        const newSessionData = Object.assign({}, this.sessionData);
        newSessionData[key] = value;
        this.sessionData = newSessionData;
        localStorage.setItem(key, value);
    }

    getSessionDataEntry(key) {
        return this.sessionData[key];
    }

    getSessionData() {
        return this.sessionData;
    }

    clearSessionData() {
        Object.keys(this.sessionData).forEach(key => {
            localStorage.removeItem(key);
        });
        this.sessionData = Object.assign({}, clearedSessionData);
    }
}

const instance = new Session();

export default instance;
