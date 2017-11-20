module.exports = FiltersDropdown;

FiltersDropdown.$inject = ['PostFilters', 'ModalService', '$rootScope', '_', '$location', 'SavedSearchEndpoint'];
function FiltersDropdown(PostFilters, ModalService, $rootScope, _, $location, SavedSearchEndpoint) {
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
            if (PostFilters.getMode() === 'savedsearch' && PostFilters.getModeId()) {
                PostFilters.setMode('all');
                var viewParam = $scope.$resolve.$transition$.params().view ? $scope.$resolve.$transition$.params().view : 'data';
                $location.url('/views/' + viewParam);
            }
            $scope.filtersVar = PostFilters.clearFilters();
            $scope.dropdownStatus.isopen = !$scope.dropdownStatus.isopen;
            PostFilters.reactiveFilters = true;
            $scope.canUpdateSavedSearch = false;

        };
        $scope.enableQuery = function () {
            PostFilters.qEnabled = true;
        };
        $scope.editSavedSearchModal = function (editOrUpdate) {
            let modalHeaderText = editOrUpdate === 'edit' ? 'set.edit_savedsearch' : 'set.update_savedsearch';

            SavedSearchEndpoint.get({id: PostFilters.getModeId()}, function (savedSearch) {
                $scope.savedSearch = savedSearch;
                $scope.savedSearch.filter = PostFilters.getActiveFilters($scope.filtersVar);
                // @TODO Prevent the user from creating one if they somehow manage to get to this point without being logged in
                $scope.savedSearch.user_id = $rootScope.currentUser ? $rootScope.currentUser.userId : null;
                ModalService.openTemplate('<saved-search-editor saved-search="savedSearch"></saved-search-editor>', modalHeaderText, 'star', $scope, false, false);
            });
        };
    }
}
