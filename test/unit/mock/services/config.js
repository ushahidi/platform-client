module.exports = [function () {
    return {
        query: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback([{
                        name: 'test config',
                        id: 1
                    }]);
                }
            }};
        },
        getFresh: function () {
            return {
                name: 'test config',
                id: 1
            };
        },
        get: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback({
                        'providers': {
                            pass: false,
                            enabledProvider: true
                        },
                        'enabledProvider': {}
                    });
                }
            }};
        },
        delete: function () {
            return {$promise: {
                then: function (successCallback) {
                    successCallback();
                }
            }};
        },
        saveCache: function (config) {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    config.providers.pass === true ? successCallback({id: 1}) : failCallback('error');
                }
            }};
        }
    };
}];
