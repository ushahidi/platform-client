module.exports = [function () {
    return {
        update: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback({
                        name: 'test data-importer',
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
        import: function (dataImporter) {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    dataImporter.id === 'pass' ? successCallback({id: 1}) : failCallback('error');
                }
            }};
        },
        upload: function (formData) {
            return {
                then: function (successCallback, failCallback) {
                    successCallback({id: 1});
                }
            };
        }
    };
}];
