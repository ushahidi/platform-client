module.exports = [function () {
    return {
        query: function () {
            return {$promise: {
                then: function (successCallback) {
                    successCallback([{
                        message: 'test reply message',
                        direction: 'outgoing',
                        id: 10,
                        parent_id: 9
                    }]);
                }
            }};
        },
        allInThread: function () {
            return {$promise: {
                then: function (successCallback) {
                    successCallback({'results': [{
                        message: 'test message',
                        direction: 'incoming',
                        id: 9,
                        parent_id: null
                    }]});
                }
            }};
        },
        get: function () {
            return {$promise: {
                then: function (successCallback) {
                    successCallback({
                        message: 'another test message',
                        direction: 'incoming',
                        id: 8
                    });
                }
            }};
        },
        save: function (reply) {
            return {$promise: {
                then: function (successCallback) {
                    successCallback({
                        message: 'reply message',
                        direction: 'outgoing',
                        parent_id: 9,
                        id: 11
                    });
                }
            }};
        }
    };
}];
