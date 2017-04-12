module.exports = [function () {
    return {
        query: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback([{
                        tag: 'test tag',
                        id: 1,
                        forms: [1]
                    }]);
                }
            }};
        },
        queryFresh: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback([{
                        tag: 'test tag',
                        id: 1,
                        forms: [1]
                    }]);
                }
            }};
        },
        getFresh: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback({
                        tag: 'test tag',
                        id: 1,
                        forms: [1]
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
        saveCache: function (tag) {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    tag.id === 'pass' ? successCallback({id: 1}) : failCallback('error');
                }
            }};
        }
    };
}];
