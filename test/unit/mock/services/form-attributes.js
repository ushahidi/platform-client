module.exports = [function () {
    return {
        query: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback([
                        {
                            name: 'test form attributes',
                            id: 1,
                            form_stage_id: 1,
                            priority: 1,
                            key: 'test_attr1',
                            type: 'input',
                            required: false
                        },
                        {
                            name: 'test form attributes 2',
                            id: 2,
                            form_stage_id: 1,
                            priority: 2,
                            key: 'test_attr2',
                            type: 'input',
                            required: true
                        },
                        {
                            name: 'media test',
                            id: 3,
                            form_stage_id: 1,
                            priority: 2,
                            key: 'media_test',
                            type: 'media',
                            required: false
                        }
                    ]);
                }
            }};
        },
        getFresh: function () {
            return {
                name: 'test form attributes',
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
        saveCache: function (attribute) {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    attribute.formId === 1 ? successCallback({id: 1}) : failCallback('error');
                }
            }};
        }
    };
}];
