module.exports = ['$q', function ($q) {
    return {
        queryFresh: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback([{
                        name: 'test role',
                        id: 1
                    }]);
                }
            }};
        },
        query: function () {
            var promise = $q.resolve([{
                name: 'test role',
                permissions: [],
                id: 1
            }]);
            return {
                $promise: promise
            };
        },
        stats: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback(
                        {'totals': [{
                            values: [1,2,3,4,5]
                        }]}
                    );
                }
            }};
        },
        get: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback({
                        name: 'test role',
                        id: 1
                    });
                }
            }};
        },
        getFresh: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback({
                        name: 'test role',
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
        saveCache: function (role) {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    role.id === 'pass' ? successCallback({id: 1}) : failCallback('error');
                }
            }};
        }
    };
}];
