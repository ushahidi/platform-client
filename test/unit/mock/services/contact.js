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
        delete: function () {
            return {$promise: {
                then: function (successCallback) {
                    successCallback();
                }
            }};
        },
        save: function (contact) {
            return function (successCallback, failCallback) {
                contact.contact === 'pass' ? successCallback({id: 1}) : failCallback('error');
            };
        },
        update: function (contact) {
            return function (successCallback, failCallback) {
                contact.id === 'pass' ? successCallback({id: 1}) : failCallback('error');
            };
        }
    };
}];
