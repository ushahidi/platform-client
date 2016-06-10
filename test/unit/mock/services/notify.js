module.exports = [function () {
    return {
        notify: function (message) {
            return {
                then: function (successCallback) {
                    successCallback();
                }
            };
        },
        errors: function (message) {
            return {
                then: function (successCallback) {
                    successCallback();
                }
            };
        },
        errorsPretranslated: function (message) {
            return {
                then: function (successCallback) {
                    successCallback();
                }
            };
        },
        error: function (message) {
            return {
                then: function (successCallback) {
                    successCallback();
                }
            };
        },
        apiErrors: function (message) {
            return {
                then: function (successCallback) {
                    successCallback();
                }
            };
        },
        confirm: function (message) {
            return {
                then: function (successCallback) {
                    successCallback();
                }
            };
        },
        confirmDelete: function (message) {
            return {
                then: function (successCallback) {
                    successCallback();
                }
            };
        },
        confirmModal: function (message, callbackEvent, buttonText, action) {
            return {
                then: function (successCallback) {
                    successCallback();
                }
            };
        }
    };
}];
