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

FilterPostsController.$inject = ['$scope', '$timeout','ModalService'];
function FilterPostsController($scope, $timeout, ModalService) {
    $scope.searchSavedToggle = false;
    $scope.cancel = cancel;
    $scope.applyFilters = applyFilters;
    $scope.openFilterModal = openFilterModal;
    $scope.openSavedModal = openSavedModal;
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

    function openFilterModal() {
        // Set active task so we know who this attribute will belong to
        ModalService.openTemplate('<filter-modal></filter-modal>', 'app.filter_by', '/img/material/svg-sprite-content-symbol.svg#ic_filter_list_24px', $scope, true, true);
    }
    function applyFilters(event) {
        // ngFormController automatically commits changes to the model ($scope.filters)
        // Just close the dropdown
        ModalService.close();
    }

    function openSavedModal() {
        ModalService.openTemplate('<saved-search-modal></saved-search-modal>', 'nav.saved_searches', '/img/iconic-sprite.svg#star', $scope, true, true);
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
