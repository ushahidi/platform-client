module.exports = [function () {
    return {
        query: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback([{
                        name: 'test form attributes',
                        id: 1
                    }]);
                }
            }};
        },
        getFresh: function () {
            return {
                name: 'test form attributes',
                id: 1
            };
        },
        delete: function () {
            return {$promise: {
                then: function (successCallback) {
                    successCallback();
                }
            }};
        },
        saveCache: function (attribute) {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    attribute.formId === 1 ? successCallback({id: 1}) : failCallback('error');
                }
            }};
        }
    };
}];
