module.exports = [function () {
    var mockedSessionData = {};
    return {
        setSessionData: function (sessionData) {
            mockedSessionData = sessionData;
        },
        getSessionData: function () {
            return mockedSessionData;
        },
        getSessionDataEntry: function (key) {
            return mockedSessionData[key];
        },
        setSessionDataEntry: function (key, value) {
            mockedSessionData[key] = value;
        }
    };
}];
