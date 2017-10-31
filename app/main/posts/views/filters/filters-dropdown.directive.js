module.exports = FiltersDropdown;

FiltersDropdown.$inject = ['PostFilters', 'ModalService', '$rootScope', '_', '$location', 'SavedSearchEndpoint', '$routeParams'];
function FiltersDropdown(PostFilters, ModalService, $rootScope, _, $location, SavedSearchEndpoint, $routeParams) {
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
            var savedSearchId = PostFilters.getModeId();
            if (savedSearchId) {
                SavedSearchEndpoint.get({id: savedSearchId}, function (savedSearch) {
                    $scope.canUpdateSavedSearch = _.contains(savedSearch.allowed_privileges, 'update');
                });
            }
        }

        $scope.applyFiltersLocked = function () {
            PostFilters.reactiveFilters = true;
            $scope.dropdownStatus.isopen = !$scope.dropdownStatus.isopen;
        };
        $scope.clearFilters = function () {
            if (PostFilters.getMode() === 'savedsearch' && PostFilters.getModeId()) {
                PostFilters.setMode('all');
                var viewParam = $routeParams.view ? $routeParams.view : 'data';
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
        $scope.saveSavedSearchModal = function () {
            $scope.savedSearch.filter = $scope.filtersVar;
            // @TODO Prevent the user from creating one if they somehow manage to get to this point without being logged in
            $scope.savedSearch.user_id = $rootScope.currentUser ? $rootScope.currentUser.userId : null;
            ModalService.openTemplate('<saved-search-editor saved-search="savedSearch"></saved-search-editor>', 'set.create_savedsearch', 'star', $scope, false, false);
        };
        $scope.editSavedSearchModal = function () {
            SavedSearchEndpoint.get({id: PostFilters.getModeId()}, function (savedSearch) {
                $scope.savedSearch = savedSearch;
                $scope.savedSearch.filter = PostFilters.getActiveFilters($scope.filtersVar);
                // @TODO Prevent the user from creating one if they somehow manage to get to this point without being logged in
                $scope.savedSearch.user_id = $rootScope.currentUser ? $rootScope.currentUser.userId : null;
                ModalService.openTemplate('<saved-search-editor saved-search="savedSearch"></saved-search-editor>', 'set.update_savedsearch', 'star', $scope, false, false);
            });
        };
    }
}
