module.exports = [function () {
    return {
        getLock: function () {
            return {$promise: {
                then: function (successCallback) {
                    successCallback();
                }
            }};
        },
        unlockByPost: function () {
            return {$promise: {
                then: function (successCallback) {
                    successCallback();
                }
            }};
        },
        unlock: function () {
            return {$promise: {
                then: function (successCallback) {
                    successCallback();
                },
                finally: function (successCallback) {
                    successCallback();
                }
            }};
        },
        options: function () {
            return {$promise: {
                then: function (successCallback) {
                    successCallback();
                }
            }};
        }
    };
}];
