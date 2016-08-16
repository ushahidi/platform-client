module.exports = [function () {
    return {
        cleanPostValues: function (post) {
            return post;
        },
        validatePost: function () {
            return true;
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
