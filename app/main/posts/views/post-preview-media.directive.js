module.exports = [
    'FormAttributeEndpoint',
    'MediaEndpoint',
    '_',
function (
    FormAttributeEndpoint,
    MediaEndpoint,
    _
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            post: '='
        },
        template: require('./post-preview-media.html'),
        link: function ($scope) {
            if (!$scope.post.form) {
                return;
            }

            FormAttributeEndpoint.query({formId: $scope.post.form.id}).$promise
                .then(function (attributes) {

                    // Use image from the first media attribute
                    var mediaAttribute = _.find(attributes, function (attribute) {
                        return attribute.type === 'media';
                    });
                    const mediaExists = mediaAttribute &&
                                        !_.isUndefined($scope.post.values[mediaAttribute.key]) &&
                                        !_.isNull($scope.post.values[mediaAttribute.key]);
                    // Get the media url and caption
                    if (mediaExists) {
                        MediaEndpoint.get({id: $scope.post.values[mediaAttribute.key]}).$promise
                            .then(function (media) {
                                $scope.media = media;
                                $scope.hasCaption = mediaAttribute.config ? mediaAttribute.config.hasCaption : true;
                            });
                    }
                });
        }
    };
}];
