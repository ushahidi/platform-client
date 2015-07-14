module.exports = [
function (
) {
    var controller = [
        '$scope',
        'GlobalFilter',
        function (
            $scope,
            GlobalFilter
        ) {
            // Initial scope
            $scope.isLoading = false;

            // Set default view
            if (!$scope.currentView) {
                $scope.currentView = 'map';
            }

            // Enable / Disable aside depending on currentView
            if ($scope.currentView === 'map') {
                $scope.hasAside = true;
            } else {
                $scope.hasAside = false;
            }
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
        templateUrl: 'templates/views/views.html'
    };
}];
