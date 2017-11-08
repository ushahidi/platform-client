module.exports = [
function (
) {
    var controller = [
        '$scope',
        '_',
        function (
            $scope,
            _
        ) {
            // Initial scope
            $scope.isLoading = {
                state: false
            };

            // Set default view
            if (!$scope.currentView) {
                $scope.currentView = 'map';
            }

            // Change mode
            $scope.$emit('event:mode:change', $scope.currentView);
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
        template: require('./post-view.html')
    };
}];
