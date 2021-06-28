module.exports = [function () {
    return {
        query: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback([
                        {
                            id: 1,
                            form_id: 1,
                            role_id: 1
                        },
                        {
                            id: 1,
                            form_id: 1,
                            role_id: 4
                        },
                        {
                            id: 1,
                            form_id: 1,
                            role_id: 2
                        }
                    ]);
                }
            }};
        },
        getFresh: function () {
            return {
                id: 1,
                form_id: 1,
                role_id: 2
            };
        },
        delete: function () {
            return {$promise: {
                then: function (successCallback) {
                    successCallback();
                }
            }};
        },
        saveCache: function (attribute) {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    attribute.formId === 1 ? successCallback({id: 1}) : failCallback('error');
                }
            }};
        }
    };
}];
