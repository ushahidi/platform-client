module.exports = FiltersDropdown;

FiltersDropdown.$inject = ['PostFilters', 'ModalService', '$rootScope'];
function FiltersDropdown(PostFilters, ModalService, $rootScope) {
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
            dropdownStatus: '=',
            applyFilters: '=',
            filtersVar: '=',
            cancel: '='
        },
        link: FiltersDropdownLink,
        template: require('./filters-dropdown.html')
    };

    function FiltersDropdownLink($scope, $element, $attrs, ngModel) {
        PostFilters.reactiveFilters = false;
        // Init an empty saved search
        $scope.savedSearch = {
            view : 'map',
            role : []
        };
        $scope.applyFiltersLocked = function () {
            PostFilters.reactiveFilters = true;
            $scope.dropdownStatus.isopen = !$scope.dropdownStatus.isopen;
        };
        $scope.clearFilters = function () {
            $scope.filtersVar = PostFilters.clearFilters();
            $scope.dropdownStatus.isopen = !$scope.dropdownStatus.isopen;
            PostFilters.reactiveFilters = true;
        };
        $scope.enableQuery = function () {
            PostFilters.qEnabled = true;
        };
        $scope.saveSavedSearchModal = function () {
            $scope.savedSearch.filter = $scope.filtersVar;
            // @TODO Prevent the user from creating one if they somehow manage to get to this point without being logged in
            $scope.savedSearch.user_id = $rootScope.currentUser ? $rootScope.currentUser.userId : null;
            ModalService.openTemplate('<saved-search-editor saved-search="savedSearch"></saved-search-editor>', 'set.create_savedsearch', 'star', $scope, false, false);

            //ModalService.openTemplate('<savedsearch-create></savedsearch-create>', 'nav.saved_searches', '/img/iconic-sprite.svg#star', $scope.$parent, true, true);
        };
    }
}
