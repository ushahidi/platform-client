module.exports = [
function (
) {
    var controller = [
        '$scope',
        'GlobalFilter',
        'Features',
        '_',
        function (
            $scope,
            GlobalFilter,
            Features,
            _
        ) {
            Features.loadFeatures().then(function () {
                // Initial scope
                $scope.isLoading = false;

                // Set default view
                if (!$scope.currentView) {
                    $scope.currentView = 'map';
                }
                if (!Features.isViewEnabled($scope.currentView)) {
                    $scope.unavailableView = $scope.currentView;
                    $scope.currentView = 'unavailable';
                }

                // Enable / Disable aside depending on currentView
                if ($scope.currentView === 'map') {
                    $scope.hasAside = true;
                } else {
                    $scope.hasAside = false;
                }
            });
        }
    ];

    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            filters: '=',
            currentView: '=',
            baseUrl: '@'
        },
        controller: controller,
        templateUrl: 'templates/views/views.html'
    };
}];
