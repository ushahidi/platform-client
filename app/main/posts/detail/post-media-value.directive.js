module.exports = ['MediaEndpoint', '_', function (MediaEndpoint, _) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            mediaId: '=',
            label: '@'
        },
        template: require('./post-media-value.html'),
        link: function ($scope) {
            if (!_.isNull($scope.mediaId)) {
                MediaEndpoint.get({id: $scope.mediaId}).$promise.then(function (media) {
                    $scope.media = media;
                });
            }
        }
    };
}];
