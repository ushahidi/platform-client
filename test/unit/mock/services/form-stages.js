module.exports = [function () {
    return {
        query: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback([
                        {
                            name: 'test form stages',
                            priority: 1,
                            id: 1
                        },
                        {
                            name: 'test form stages 2',
                            priority: 2,
                            id: 2
                        }
                    ]);
                }
            }};
        },
        invalidateCache: function () {},
        get: function () {
            return {
                name: 'test form stages',
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
        save: function (stage) {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    stage.formId === 1 ? successCallback({id: 1}) : failCallback('error');
                }
            }};
        }
    };
}];
