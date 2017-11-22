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
        template: require('./filter-posts.html')
    };
}

FilterPostsController.$inject = ['$scope', '$timeout','ModalService', 'PostFilters', '$state'];
function FilterPostsController($scope, $timeout, ModalService, PostFilters, $state) {
    $scope.searchSavedToggle = false;
    $scope.qFilter = '';
    $scope.view = $state.params.view;
    activate();

    $scope.status = {
        isopen: false
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
}
