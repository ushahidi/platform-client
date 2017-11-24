module.exports = FiltersDropdown;

FiltersDropdown.$inject = [];
function FiltersDropdown() {
    return {
        restrict: 'E',
        scope: {
            dropdownStatus: '=',
            filters: '='
        },
        controller: FiltersDropdownController,
        template: require('./filters-dropdown.html')
    };
}

FiltersDropdownController.$inject = ['$scope', '$state', 'PostFilters', 'ModalService', '$rootScope', '_', '$location', 'SavedSearchEndpoint'];
function FiltersDropdownController($scope, $state, PostFilters, ModalService, $rootScope, _, $location, SavedSearchEndpoint) {
    $scope.canUpdateSavedSearch = false;
    PostFilters.reactiveFilters = false;

    $scope.$watch(PostFilters.getModeId, function (newValue, oldValue) {
        if (oldValue !== newValue || typeof ($scope.canUpdateSavedSearch) === 'undefined') {
            setSavedSearchUpdateStatus();
        }
    });
    // Init an empty saved search
    $scope.savedSearch = {
        view : 'map',
        role : []
    };
    // Check if we can edit
    function setSavedSearchUpdateStatus() {
        var savedSearch = PostFilters.getModeEntity();

        $scope.canUpdateSavedSearch = savedSearch && _.contains(savedSearch.allowed_privileges, 'update');
    }

    $scope.applyFiltersLocked = function () {
        PostFilters.reactiveFilters = true;
        $scope.dropdownStatus.isopen = !$scope.dropdownStatus.isopen;
    };
    $scope.clearFilters = function () {
        if (PostFilters.getMode() === 'savedsearch' && PostFilters.getModeId()) {
            PostFilters.setMode('all');

            if ($state.$current.includes['posts.map']) {
                $state.go('posts.map.all');
            } else {
                $state.go('posts.data');
            }
        }
        $scope.filters = PostFilters.clearFilters();
        $scope.dropdownStatus.isopen = !$scope.dropdownStatus.isopen;
        PostFilters.reactiveFilters = true;
        $scope.canUpdateSavedSearch = false;
    };
    $scope.enableQuery = function () {
        PostFilters.qEnabled = true;
    };
    $scope.saveSavedSearchModal = function () {
        $scope.savedSearch.filter = $scope.filters;
        // @TODO Prevent the user from creating one if they somehow manage to get to this point without being logged in
        $scope.savedSearch.user_id = $rootScope.currentUser ? $rootScope.currentUser.userId : null;
        ModalService.openTemplate('<saved-search-editor saved-search="savedSearch"></saved-search-editor>', 'set.create_savedsearch', 'star', $scope, false, false);
    };
    $scope.editSavedSearchModal = function (editOrUpdate) {
        let modalHeaderText = editOrUpdate === 'edit' ? 'set.edit_savedsearch' : 'set.update_savedsearch';
        $scope.savedSearch = PostFilters.getModeEntity();
        $scope.savedSearch.filter = PostFilters.getActiveFilters($scope.filters);
        // @TODO Prevent the user from creating one if they somehow manage to get to this point without being logged in
        $scope.savedSearch.user_id = $rootScope.currentUser ? $rootScope.currentUser.userId : null;
        ModalService.openTemplate('<saved-search-editor saved-search="savedSearch"></saved-search-editor>', modalHeaderText, 'star', $scope, false, false);

    };
}
