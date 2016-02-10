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
                  post.id === 'pass' ? successCallback({id:1}) : failCallback('error');
                }
            }};
        }
    };
}];
