module.exports = [function () {
    return {
        createSocketListener: function () {
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
                }
            }};
        },
        getLock: function () {
            return {$promise: {
                then: function (successCallback) {
                    successCallback();
                }
            }};
        },
        isPostLockedForCurrentUser: function () {
            return {$promise: {
                then: function (successCallback) {
                    successCallback();
                }
            }};
        }
    };
}];
