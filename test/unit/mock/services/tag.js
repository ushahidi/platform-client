module.exports = [function () {
    return {
        query: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback([{
                        tag: 'test tag',
                        id: 1,
                        children: []
                    }]);
                }
            }};
        },
        queryFresh: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback([{
                        tag: 'test tag',
                        id: 1,
                        parent_id: null,
                        children: []
                    },{
                        tag: 'test child',
                        id: 2,
                        children: [],
                        parent_id: 1
                    }]);
                }
            }};
        },
        getFresh: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback({
                        tag: 'test tag',
                        id: 1,
                        children: []
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
        saveCache: function (tag) {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    tag.id === 'pass' ? successCallback({id: 1}) : failCallback('error');
                }
            }};
        }
    };
}];
