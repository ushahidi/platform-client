module.exports = [function () {
    return {
        saveMedia: function (media, post) {
            return {
                then: function (successCallback, failCallback) {
                        successCallback(
                        {'results': [{
                                id: 1
                            }]
                        });
                    }
            };
        },
        deleteMedia: function () {
            return true;
        },
        update: function () {
            return true;
        },
        uploadFile: function (dataImporter) {
            return true;
        }
    };
}];
