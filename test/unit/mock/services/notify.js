module.exports = [function () {
    return {
        showNotificationSlider: function (message) {
            return {
                then: function (successCallback) {
                    successCallback();
                }
            };
        },
        showAlerts: function (message) {
            return {
                then: function (successCallback) {
                    successCallback();
                }
            };
        },
        showSingleAlert: function (message) {
            return {
                then: function (successCallback) {
                    successCallback();
                }
            };
        },
        showApiErrors: function (message) {
            return {
                then: function (successCallback) {
                    successCallback();
                }
            };
        },
        showConfirm: function (message) {
            return {
                then: function (successCallback) {
                    successCallback();
                }
            };
        },
        showConfirmAlert: function (message) {
            return {
                then: function (successCallback) {
                    successCallback();
                }
            };
        },
        showConfirmModal: function (message, callbackEvent, buttonText, action) {
            return {
                then: function (successCallback) {
                    successCallback();
                }
            };
        }
    };
}];
