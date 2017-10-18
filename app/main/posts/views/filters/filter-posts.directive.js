module.exports = FilterPostsDirective;

FilterPostsDirective.$inject = [];
function FilterPostsDirective() {
    return {
        restrict: 'E',
        scope: {
            filters: '=',
            currentView: '=',

        },
        replace: true,
        controller: FilterPostsController,
        template: require('./filter-posts.html')
    };
}

FilterPostsController.$inject = ['$scope', '$timeout','ModalService', 'PostFilters', '$routeParams', '$log'];
function FilterPostsController($scope, $timeout, ModalService, PostFilters, $routeParams, $log) {
    $scope.searchSavedToggle = false;
    $scope.cancel = cancel;
    $scope.applyFilters = applyFilters;
    $scope.qFilter = '';
    $scope.openSavedModal = openSavedModal;
    $scope.dropdownToggleStatus = {}
    activate();

    $scope.status = {
        isopen: false
      };

      $scope.toggled = function(open) {
        $log.log('Dropdown is now: ', open);
      };

    $scope.toggleDropdown = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };
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
    }

    function rollbackForm() {
        PostFilters.clearFilters();
    }
    function openSavedModal() {
        ModalService.openTemplate('<saved-search-modal></saved-search-modal>', 'nav.saved_searches', '/img/iconic-sprite.svg#star', $scope, true, true);
    }
}
