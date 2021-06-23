module.exports = [function () {
    return {
        queryFresh: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback({'results': [
                        {
                            name: 'test data-provider',
                            id: 'pass'
                        },
                        {
                            name: 'test data-provider 2',
                            id: 'enabledProvider'
                        }
                    ]});
                }
            }};
        },
        getFresh: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback({
                        name: 'test data-provider',
                        id: 1
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
        saveCache: function (dataProvider) {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    dataProvider.id === 'pass' ? successCallback({id: 1}) : failCallback('error');
                }
            }};
        }
    };
}];
