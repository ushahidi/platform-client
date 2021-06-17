module.exports = [function () {
    return {
        queryFresh: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback({'results': [{
                            'id': 1,
                            'user': {
                                'id': 1
                            },
                            'config_key': 'abcsdef',
                            'config_value': 'absdedd'
                        }]});
                }
            }};
        },
        query: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback([{
                        'id': 1,
                        'user': {
                            'id': 1
                        },
                        'config_key': 'abcsdef',
                        'config_value': 'absdedd'
                    }]);
                }
            }};
        },
        getFresh: function () {
            return {$promise: {
                then: function (successCallback) {
                    successCallback({
                        'id': 1,
                        'user': {
                            'id': 1
                        },
                        'config_key': 'abcsdef',
                        'config_value': 'absdedd'
                    });
                }
            }};
        },
        get: function () {
            return {$promise: {
                then: function (successCallback) {
                    successCallback({
                        'id': 1,
                        'user': {
                            'id': 1
                        },
                        'config_key': 'abcsdef',
                        'config_value': 'absdedd'
                    });
                }
            }};
        }
    };
}];
