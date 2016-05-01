module.exports = [function () {
    return {
        cleanPostValues: function (post) {
            return post;
        },
        canSavePost: function () {
            return true;
        },
        isFirstStage: function (dataImporter) {
            return true;
        },
        isStageValid: function (formData) {
            return true;
        }
    };
}];
