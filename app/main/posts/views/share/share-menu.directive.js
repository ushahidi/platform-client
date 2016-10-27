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
    'Util'
];
function ShareMenuController(
    $scope,
    Util
) {
    $scope.loading = false;
    $scope.shareUrl = Util.deploymentUrl();
    $scope.shareUrlEncoded = encodeURIComponent($scope.shareUrl);

    activate();

    function activate() {

    }
}
