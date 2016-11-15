module.exports = PostVideoValue;

PostVideoValue.$inject = [];

function PostVideoValue() {
    return {
        restrict: 'E',
        scope: {
            videoUrl: '=',
            label: '@'
        },
        templateUrl: 'templates/main/posts/detail/post-video-value.html',
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
        $scope.videoUrl = $sce.trustAsResourceUrl($scope.videoUrl[0]);
    }
}
