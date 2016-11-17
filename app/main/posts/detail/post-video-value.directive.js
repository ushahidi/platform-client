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
        $scope.videoUrl = $sce.trustAsResourceUrl($scope.videoUrl[0]);
    }
}
