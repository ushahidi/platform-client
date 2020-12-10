module.exports = PostVideoValue;

PostVideoValue.$inject = [];

function PostVideoValue() {
    return {
        restrict: 'E',
        scope: {
            videoUrl: '=',
            label: '@'
        },
        template: require('./post-video-value.html'),
        controller: PostVideoValueController
    };
}

PostVideoValueController.$inject = [
    '$scope',
    '$sce'
];

function PostVideoValueController(
    $scope,
    $sce
) {
    activate();

    function activate() {
        if ($scope.videoUrl && $scope.videoUrl.length > 0) {
            $scope.videoUrl = $sce.trustAsResourceUrl($scope.videoUrl);
        }
    }
}
