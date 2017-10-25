module.exports = ['MediaEndpoint', '_', function (MediaEndpoint, _) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            mediaId: '=',
            label: '@',
            mediaHasCaption: '='
        },
        template: require('./post-media-value.html'),
        link: MediaValueLink
    };

    function MediaValueLink($scope) {
        function loadMedia()
        {
            if (!_.isNull($scope.mediaId)) {
                MediaEndpoint.get({id: $scope.mediaId}).$promise.then(function (media) {
                    $scope.media = media;
                });
            }
        }

        $scope.$watch('mediaId', function (newMediaId, oldMediaId) {
            if (newMediaId !== oldMediaId) {
                loadMedia();
            }
        });
    }

}];
