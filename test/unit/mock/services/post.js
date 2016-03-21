module.exports = [function () {
    return {
        query: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback({results: [{
                        name: 'test post',
                        allowed_privileges: [
                            'update',
                            'delete',
                            'change_status'
                        ],
                        id: 1
                    }]});
                }
            }};
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
        options: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback({
                        allowed_privileges: ['read'],
                        name: 'test post',
                        id: 1
                    });
                }
            }};
        },
        geojson: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback({
                        name: 'test post',
                        id: 1
                    });
                }
            }};
        },
        get: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback({
                        name: 'test post',
                        id: 1
                    });
                }
            }};
        },
        getFresh: function () {
            return {
                name: 'test post',
                id: 1
            };
        },
        delete: function (post) {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    post.id === 'pass' ? successCallback({id: 1, allowed_privileges: ['read']}) : failCallback('error');
                }
            }};
        },
        saveCache: function (post) {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    post.id === 'pass' ? successCallback({id: 1, allowed_privileges: ['read']}) : failCallback('error');
                }
            }};
        },
        update: function (post) {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    post.id === 'pass' ? successCallback({id: 1, allowed_privileges: ['read']}) : failCallback(
                    {
                        data: {
                            errors: [
                                'error'
                            ]
                        }
                    });
                }
            }};
        }
    };
}];
