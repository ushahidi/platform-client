module.exports = [
function (
) {
    var controller = [
        '$scope',
        'ViewHelper',
        '_',
        function (
            $scope,
            ViewHelper,
            _
        ) {
            // Initial scope
            $scope.isLoading = false;

            // Set default view
            if (!$scope.currentView) {
                $scope.currentView = 'map';
            }

            // Change mode
            $scope.$emit('event:mode:change', $scope.currentView);

            // Watch views, in case we get new feature config
            /* ViewHelper.isViewAvailable($scope.currentView).then(function (available) {
                if (!available) {
                    $scope.unavailableView = $scope.currentView;
                    $scope.currentView = 'unavailable';
                }

                // Enable / Disable aside depending on currentView
                if ($scope.currentView === 'map') {
                    $scope.hasAside = true;
                } else {
                    $scope.hasAside = false;
                }
            }); */
        }
    ];

    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            filters: '=',
            currentView: '='
        },
        controller: controller,
        templateUrl: 'templates/posts/views/post-view.html'
    };
}];
