module.exports = FiltersDropdown;

FiltersDropdown.$inject = ['PostFilters', 'ModalService', '$rootScope', '_', '$location', 'SavedSearchEndpoint'];
function FiltersDropdown(PostFilters, ModalService, $rootScope, _, $location, SavedSearchEndpoint) {
    return {
        restrict: 'E',
        scope: {
            dropdownStatus: '=',
            filters: '=',
            view: '<'
        },
        link: FiltersDropdownLink,
        template: require('./filters-dropdown.html')
    };
    function FiltersDropdownLink($scope, $element, $attrs) {
        $scope.canUpdateSavedSearch;
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

        $scope.clearFilters = function () {
            if (PostFilters.getMode() === 'savedsearch' && PostFilters.getModeId()) {
                PostFilters.setMode('all');
                // @uirouter-refactor this is very wrong.
                var viewParam = $scope.view ? $scope.view : 'data';
                $location.url('/views/' + viewParam);
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
}
