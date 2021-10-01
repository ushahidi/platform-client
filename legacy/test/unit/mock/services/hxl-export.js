module.exports = [function () {
    return {
        getFormsWithTags: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback([{
                        name: 'test form',
                        id: 1,
                        attributes: [
                            {
                                name: 'test form attributes',
                                id: 1,
                                form_stage_id: 1,
                                priority: 1,
                                key: 'test_attr1',
                                type: 'input',
                                required: false,
                                tags: []
                            }
                        ]
                    }]);
                }
            }};
        }
    };
}];
