module.exports = [function () {
    return {
        get: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback({results: []});
                }
            }};
        }
    };
}];
