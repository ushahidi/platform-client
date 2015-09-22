module.exports = [
function (
) {
    var controller = [
        '$scope',
        'GlobalFilter',
        'PostViewHelper',
        '_',
        function (
            $scope,
            GlobalFilter,
            PostViewHelper,
            _
        ) {
            // Initial scope
            $scope.isLoading = false;

            $scope.views = PostViewHelper.views();

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
            currentView: '=',
            baseUrl: '@'
        },
        controller: controller,
        templateUrl: 'templates/views/views.html'
    };
}];
