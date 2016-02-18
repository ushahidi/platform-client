module.exports = [function () {
    return {
        query: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback([{
                        name: 'test post',
                        id: 1
                    }]);
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
        delete: function () {
            return {$promise: {
                then: function (successCallback) {
                    successCallback();
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
                    post.id === 'pass' ? successCallback({id: 1, allowed_privileges: ['read']}) : failCallback('error');
                }
            }};
        }
    };
}];
