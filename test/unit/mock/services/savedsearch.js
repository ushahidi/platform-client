module.exports = [function () {
    return {
        queryFresh: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback({'results': [{
                            name: 'test savedsearch',
                            id: 1
                        }]});
                }
            }};
        },
        get: function () {
            return {$promise: {
                then: function (successCallback) {
                    successCallback({
                        name: 'test savedsearch',
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
        saveCache: function (savedsearch) {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    savedsearch.id === 'pass' ? successCallback({id: 1}) : failCallback('error');
                }
            }};
        }
    };
}];
