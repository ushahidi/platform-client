module.exports = [function () {
    return {
        query: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback([{
                        name: 'test form',
                        id: 1
                    }]);
                }
            }};
        },
        queryFresh: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback([{
                        name: 'test form',
                        id: 1,
                        tags: [{
                            id: 1,
                            tag: 'Test-tag'
                        }]},
                        {
                        name: 'test form 2',
                        id: 2,
                        tags: [{
                            id: 1,
                            tag: 'Test-tag'
                        }]}
                    ]);
                }
            }};
        },
        get: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback({
                        name: 'test form',
                        id: 1
                    });
                }
            }};
        },
        getFresh: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback({
                        name: 'test form',
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
        saveCache: function (form) {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    form.id === 'pass' ? successCallback({id: 1}) : failCallback('error');
                }
            }};
        }
    };
}];
