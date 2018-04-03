module.exports = ShareMenuDirective;

ShareMenuDirective.$inject = [];
function ShareMenuDirective() {
    return {
        restrict: 'E',
        scope: {
            filters: '=',
            surveyId: '=',
            postId: '='
        },
        replace: true,
        controller: ShareMenuController,
        template: require('./share-menu.html')
    };
}

ShareMenuController.$inject = [
    '$scope',
    'Util',
    '$window'
];
function ShareMenuController(
    $scope,
    Util,
    $window
) {

    $scope.loading = false;
    $scope.shareUrl = Util.currentUrl();
    $scope.isExportable = isExportable;

    activate();

    function activate() {
        // If we are in a post action menu
        // Then we have to change the url to ensure that when
        // selected from either the map or timeline view for
        // an individual post that the URL is correct
        if ($scope.postId) {
            $scope.shareUrl = $window.location.origin + '/posts/' + $scope.postId;
        }

        if ($scope.surveyId) {
            $scope.shareUrl = $window.location.origin + '/posts/create/' + $scope.surveyId;
        }

        $scope.shareUrlEncoded = encodeURIComponent($scope.shareUrl);
    }
    // Check if current view is exportable
    function isExportable() {
        return true;
    }
}
