module.exports = FiltersDropdown;

FiltersDropdown.$inject = [];
function FiltersDropdown() {
    return {
        restrict: 'E',
        scope: {
            dropdownStatus: '=',
            filters: '=',
            stats: '='
        },
        controller: FiltersDropdownController,
        template: require('./filters-dropdown.html')
    };
}

FiltersDropdownController.$inject = ['$scope', '$state', 'PostFilters', 'ModalService', '$rootScope', '_', 'TranslationService'];
function FiltersDropdownController($scope, $state, PostFilters, ModalService, $rootScope, _, TranslationService) {
    $scope.canUpdateSavedSearch = false;
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
    TranslationService.getLanguage().then(language => {
        $scope.userLanguage = language;
    });
    // Check if we can edit
    function setSavedSearchUpdateStatus() {
        var savedSearch = PostFilters.getModeEntity('savedsearch');

        $scope.canUpdateSavedSearch = savedSearch && _.contains(savedSearch.allowed_privileges, 'update');
    }

    $scope.clearFilters = function () {
        if (_.contains(['savedsearch', 'collection'], PostFilters.getMode()) && PostFilters.getModeId()) {
            PostFilters.setMode('all');
            if ($state.$current.includes['posts.map']) {
                $state.go('posts.map.all');
            } else {
                $state.go('posts.data');
            }
        }
        $scope.filters = PostFilters.clearFilters();
        $scope.dropdownStatus.isopen = !$scope.dropdownStatus.isopen;
        $scope.canUpdateSavedSearch = false;
    };

    $scope.saveSavedSearchModal = function () {
        $scope.savedSearch.filter = $scope.filters;
        // @TODO Prevent the user from creating one if they somehow manage to get to this point without being logged in
        $scope.savedSearch.user_id = $rootScope.currentUser ? $rootScope.currentUser.userId : null;
        ModalService.openTemplate('<saved-search-editor saved-search="savedSearch"></saved-search-editor>', 'set.create_savedsearch', 'star', $scope, false, false);
    };
    $scope.editSavedSearchModal = function (editOrUpdate) {
        let modalHeaderText = editOrUpdate === 'edit' ? 'set.edit_savedsearch' : 'set.update_savedsearch';
        $scope.savedSearch = PostFilters.getModeEntity('savedsearch');
        $scope.savedSearch.filter = PostFilters.getActiveFilters($scope.filters);
        // @TODO Prevent the user from creating one if they somehow manage to get to this point without being logged in
        $scope.savedSearch.user_id = $rootScope.currentUser ? $rootScope.currentUser.userId : null;
        ModalService.openTemplate('<saved-search-editor saved-search="savedSearch"></saved-search-editor>', modalHeaderText, 'star', $scope, false, false);
    };

    $scope.getButtonText = function () {
        if ($state.$current.includes['posts.map']) {
            return 'app.close_and_view';
        }
        return 'app.apply_filters';
    };

    $scope.setFiltersToLocalStorage = function () {
        if ($rootScope.currentUser) {
            localStorage.setItem('ush-filterState', JSON.stringify($scope.filters));
        }
        if (!$rootScope.currentUser) {
            localStorage.setItem('ush-filterState-2', JSON.stringify($scope.filters));
        }
    }

    $scope.displayStats = function () {
        return $state.$current.includes['posts.map'];
    };
}

