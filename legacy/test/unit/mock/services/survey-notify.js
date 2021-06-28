module.exports = [function () {
    return {
        success: function (message) {
            return {
                then: function (successCallback) {
                    successCallback();
                }
            };
        }
    };
}];
