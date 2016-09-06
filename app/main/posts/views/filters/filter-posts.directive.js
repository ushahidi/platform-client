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
        // $scope.$watch('filters', handleFilterChange, true);
    }

    function cancel() {
        // Reset filters
        rollbackForm();
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

        // Reset the form
        rollbackForm();
    }

    function rollbackForm() {
        // Store value of q
        var q = $scope.postFiltersForm.q.$viewValue;
        // Rolback form
        $scope.postFiltersForm.$rollbackViewValue();
        // Restore value of q
        $scope.postFiltersForm.q.$setViewValue(q);
        $scope.postFiltersForm.q.$render();
    }
}
