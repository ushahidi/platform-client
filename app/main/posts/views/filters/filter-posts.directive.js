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

FilterPostsController.$inject = ['$scope', '$timeout','ModalService', 'PostFilters'];
function FilterPostsController($scope, $timeout, ModalService, PostFilters) {
    $scope.searchSavedToggle = false;
    $scope.cancel = cancel;
    $scope.applyFilters = applyFilters;
    $scope.filtersDropdownToggle = false;
    activate();

    function activate() {
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
        console.log(11);
        // ngFormController automatically commits changes to the model ($scope.filters)
        // Just close the dropdown
        ModalService.close();
    }

    function rollbackForm() {
        PostFilters.clearFilters();
    }
}
