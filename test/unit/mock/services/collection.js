module.exports = [function () {
    return {
        query: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback({'results': [{
                        name: 'test collection',
                        id: 1
                    }]});
                }
            }};
        },
        queryFresh: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback({'results': [{
                        name: 'test collection',
                        id: 1
                    }]});
                }
            }};
        },
        editableByMe: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback({'results': [{
                        name: 'test collection',
                        id: 1
                    }]});
                }
            }};
        },
        get: function () {
            return {$promise: {
                then: function (successCallback) {
                    successCallback({
                        name: 'test collection',
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
        saveCache: function (collection) {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    collection.id === 'pass' ? successCallback({id: 1}) : failCallback('error');
                }
            }};
        }

    };
}];
