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
        query: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback([{
                        name: 'test user',
                        id: 1
                    }]);
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
        get: function () {
            return {$promise: {
                then: function (successCallback) {
                    successCallback({
                        name: 'test user',
                        id: 1
                    });
                }
            }};
        },
        update: function (_, user) {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    if (user.email !== 'Bad email') {
                        successCallback({
                            realname: 'Changed name',
                            id: 1,
                            someField: 'addedByServer',
                            email: 'changed@ushahidi.com'
                        });
                    } else {
                        failCallback({
                            status: 400,
                            data: {
                                'errors': [
                                    {
                                        'message': 'invalid email address'
                                    }
                                ]
                            }
                        });
                    }
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
        saveCache: function (user) {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    user.id === 'pass' ? successCallback({id: 1}) : failCallback({data: {errors: 'error'}});
                }
            }};
        }

    };
}];
