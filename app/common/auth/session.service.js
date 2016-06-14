module.exports = [
    'localStorageService',
function (
    localStorageService
) {

    this.clearedSessionData = {
        userId: undefined,
        realname: undefined,
        email: undefined,
        accessToken: undefined,
        role: undefined,
        permissions: undefined,
        loginPath: undefined,
        gravatar: undefined
    };

    this.sessionData = angular.copy(this.clearedSessionData);

    var that = this;

    var loadSessionData = function () {
        var newSessionData = {};
        Object.keys(that.sessionData).forEach(function (key) {
            newSessionData[key] = localStorageService.get(key);
        });
        that.sessionData = newSessionData;
    };

    var setSessionDataEntries = function (entries) {
        Object.keys(entries).forEach(function (key) {
            localStorageService.set(key, entries[key]);
        });
        var newSessionData = angular.extend({}, that.sessionData, entries);
        that.sessionData = newSessionData;
    };

    var setSessionDataEntry = function (key, value) {
        that.sessionData[key] = value;
        localStorageService.set(key, value);
    };

    var getSessionDataEntry = function (key) {
        return that.sessionData[key];
    };

    var getSessionData = function () {
        return that.sessionData;
    };

    var clearSessionData = function () {
        Object.keys(that.sessionData).forEach(function (key) {
            localStorageService.remove(key);
        });
        that.sessionData = angular.copy(that.clearedSessionData);
    };

    // load already saved session data from earlierer session
    // from local storage when session service is intialized loadSessionData();
    loadSessionData();

    return {
        setSessionDataEntry: setSessionDataEntry,
        setSessionDataEntries: setSessionDataEntries,
        getSessionDataEntry: getSessionDataEntry,
        getSessionData: getSessionData,
        clearSessionData: clearSessionData
    };
}];
