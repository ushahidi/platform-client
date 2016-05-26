module.exports = FilterPostsDirective;

FilterPostsDirective.$inject = [];
function FilterPostsDirective() {
    return {
        restrict: 'E',
        scope: {
            filters: '='
        },
        replace: true,
        controller: FilterPostsController,
        templateUrl: 'templates/posts/views/filters/filter-posts.html'
    };
}

FilterPostsController.$inject = ['$scope', '$timeout'];
function FilterPostsController($scope, $timeout) {
    $scope.searchSavedToggle = false;
    $scope.searchFiltersToggle = false;
    $scope.cancel = cancel;
    $scope.applyFilters = applyFilters;
    $scope.toggleSaved = toggleSaved;
    $scope.toggleFilters = toggleFilters;

    activate();

    function activate() {
        // @todo define initial filter values
    }

    // @todo watch filters for changes

    function cancel() {
        // Reset filters
        $scope.postFiltersForm.$rollbackViewValue();
        // .. and close the dropdown
        $scope.searchFiltersToggle = false;
    }

    function applyFilters(event) {
        // ngFormController automatically commits changes to the model ($scope.filters)
        // Just close the dropdown
        $scope.searchFiltersToggle = false;
    }

    function toggleSaved() {
        $scope.searchSavedToggle = !$scope.searchSavedToggle;
        $scope.searchFiltersToggle = false;
    }

    function toggleFilters() {
        $scope.searchFiltersToggle = !$scope.searchFiltersToggle;
        $scope.searchSavedToggle = false;

        // If we're toggling closed
        if ($scope.searchFiltersToggle == false) {
            // .. reset the form
            // @todo avoid resetting 'q'
            $scope.postFiltersForm.$rollbackViewValue();
        }
    }
}
