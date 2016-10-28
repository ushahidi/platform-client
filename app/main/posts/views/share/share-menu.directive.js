module.exports = ShareMenuDirective;

ShareMenuDirective.$inject = [];
function ShareMenuDirective() {
    return {
        restrict: 'E',
        replace: true,
        controller: ShareMenuController,
        templateUrl: 'templates/main/posts/views/share/share-menu.html'
    };
}

ShareMenuController.$inject = [
    '$scope',
    '$routeParams',
    'Util',
    '$window'
];
function ShareMenuController(
    $scope,
    $routeParams,
    Util,
    $window
) {
    $scope.loading = false;
    $scope.shareUrl = Util.currentUrl();

    activate();

    function activate() {
        // If we are in a post action menu
        // Then we have to change the url to ensure that when
        // selected from either the map or timeline view for
        // an individual post that the URL is correct
        if ($scope.postId) {
            $scope.shareUrl = $window.location.origin + '/posts/' + $scope.postId;
        }
        $scope.shareUrlEncoded = encodeURIComponent($scope.shareUrl);
    }
}
