module.exports = [function () {
    return {
        queryFresh: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback({'results': [{
                        name: 'test user',
                        id: 1
                    }]});
                }
            }};
        },
        getFresh: function () {
            return {$promise: {
                then: function (successCallback) {
                    successCallback({
                        name: 'test user',
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
        invalidateCache: function (user) {
            return;
        },
        enable2fa: function (user) {
            return;
        },
        disable2fa: function (user) {
            return;
        },
        verify2fa: function (user) {
            return;
        },
        saveCache: function (user) {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    user.id === 'pass' ? successCallback({id: 1}) : failCallback({data: {errors: 'error'}});
                }
            }};
        },
        update: function (user) {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    user.id === 'pass' ? successCallback({id: 1}) : failCallback({data: {errors: 'error'}});
                }
            }};
        }
    };
}];
