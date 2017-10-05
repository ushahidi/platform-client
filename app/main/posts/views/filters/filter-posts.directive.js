module.exports = FilterPostsDirective;

FilterPostsDirective.$inject = [];
function FilterPostsDirective() {
    return {
        restrict: 'E',
        scope: {
            filters: '=',
            currentView: '='
        },
        replace: true,
        controller: FilterPostsController,
        template: require('./filter-posts.html')
    };
}

FilterPostsController.$inject = ['$scope', '$timeout','ModalService', 'PostFilters', '$routeParams'];
function FilterPostsController($scope, $timeout, ModalService, PostFilters, $routeParams) {
    $scope.searchSavedToggle = false;
    $scope.cancel = cancel;
    $scope.applyFilters = applyFilters;
    $scope.filtersDropdownToggle = false;
    $scope.searchDropdownToggle = $routeParams.view !== 'list';

    activate();

    function activate() {
        console.log($scope.filters);
        // @todo define initial filter values
        // $scope.$watch('filters', handleFilterChange, true);
    }

    function cancel() {
        // Reset filters
        rollbackForm();
        // .. and close the dropdown
        ModalService.close();
    }

    function applyFilters(event) {
    }

    function rollbackForm() {
        PostFilters.clearFilters();
    }
}
