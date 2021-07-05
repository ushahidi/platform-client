module.exports = [function () {
    return {
        cleanPostValues: function (post) {
            return post;
        },
        cleanTagValues: function (post) {
            return post;
        },
        validatePost: function () {
            return true;
        },
        validateVideoUrl: function (url) {
            if (url === 'https://www.youtube.com/video/1234') {
                return ['https://www.youtube.com/embed/1234', 'https:', 'www.', 'youtube.com', 'be.com', 'embed/', '1234', undefined]
            } else {
                return null;
            }
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
