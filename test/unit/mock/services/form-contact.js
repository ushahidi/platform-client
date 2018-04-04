module.exports = [function () {
    return {
        query: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback({'results': [{
                            contact: 'test@ushahidi.com',
                            id: 1
                        }]});
                }
            }};
        },
        get: function () {
            return {$promise: {
                then: function (successCallback) {
                    successCallback({
                        contact: 'test@ushahidi.com',
                        id: 1
                    });
                }
            }};
        },
        update: function (contact) {
            return function (successCallback, failCallback) {
                contact.id === 'pass' ? successCallback({id: 1}) : failCallback('error');
            };
        },
        save: function (contact) {
            return function (successCallback, failCallback) {
                contact.formId === '1' ? successCallback({id: 1}) : failCallback('error');
            };
        }
    };
}];
