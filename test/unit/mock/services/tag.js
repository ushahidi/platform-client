module.exports = [function () {
    return {
        query: function () {
            return [{
                name: 'test tag',
                id: 1
            }];
        },
        delete: function () {
            return {$promise: {
                then: function (successCallback) {
                    successCallback();
                }
            }};
        }
    };
}];
