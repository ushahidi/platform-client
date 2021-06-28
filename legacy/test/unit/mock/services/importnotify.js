module.exports = [function () {
    return {
        importComplete: function (message) {
            return {
                then: function (successCallback) {
                    successCallback();
                }
            };
        },
        getScope: function () {
            return {
                then: function (successCallback) {
                    successCallback();
                }
            };
        }
    };
}];
