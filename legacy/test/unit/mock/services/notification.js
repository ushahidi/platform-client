module.exports = [function () {
    return {
        query: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback([{
                        name: 'test notification',
                        set: {id: 1},
                        id: 1
                    }]);
                }
            }};
        },
        get: function () {
            return {$promise: {
                then: function (successCallback) {
                    successCallback({
                        name: 'test notification',
                        id: 1
                    });
                }
            }};
        },
        delete: function (notification) {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    notification.id === 'pass' ? successCallback({id: 1}) : failCallback('error');
                }
            }};
        },
        save: function (notification) {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    notification.set === 'pass' ? successCallback({id: 1}) : failCallback('error');
                }
            }};
        }
    };
}];
