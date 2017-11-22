module.exports = ActiveSearchFilters;

ActiveSearchFilters.$inject = ['$translate', '$filter', 'PostFilters', '_', 'FilterTransformers'];
function ActiveSearchFilters($translate, $filter, PostFilters, _, FilterTransformers) {
    return {
        restrict: 'E',
        scope: true,
        require: 'ngModel',
        template: require('./active-search-filters.html'),
        link: ActiveFiltersLink
    };

    function ActiveFiltersLink($scope, ngModel) {
        $scope.activeFilters = {};
        $scope.savedSearch = null;
        $scope.removeFilter = removeFilter;
        $scope.transformFilterValue = transformFilterValue;
        $scope.removeSavedSearch = removeSavedSearch;
        $scope.showSaveSavedSearchButton = showSaveSavedSearchButton;
        $scope.userCanUpdateSavedSearch = false;

        activate();
        $scope.$on('savedSearch:update', function () {
            handleFiltersUpdate(PostFilters.getActiveFilters(PostFilters.getFilters()));
        });

        $scope.isArray = angular.isArray;

        function activate() {
            FilterTransformers.requestsFiltersData().then(function (all) {
                $scope.$watch(function () {
                    return PostFilters.getActiveFilters(PostFilters.getFilters());
                }, handleFiltersUpdate, true);
            });
        }

        function handleFiltersUpdate(filters, oldValue) {
            var activeFilters = angular.copy(PostFilters.getCleanActiveFilters(filters));
            FilterTransformers.rawFilters = angular.copy(filters);
            // Remove set filter as it is only relevant to collections and should be immutable in that view
            delete activeFilters.set;
            var savedSearchEntity = PostFilters.getModeEntity();
            var savedSearchChanged = $scope.savedSearch && savedSearchEntity && savedSearchEntity.id !== $scope.savedSearch.id;
            var isModeSavedSearch = PostFilters.getMode() === 'savedsearch';
            // if it's a different saved search, set it in the scope.
            // else if there is no saved search but we did find that the mode is 'savedsearch' , get it and set in scope
            if (isModeSavedSearch || savedSearchChanged) {
                $scope.savedSearch = savedSearchEntity;
            } else if (!isModeSavedSearch) {
                $scope.savedSearch = null;
            }

            /**
             * This handles the requirement to have saved search filters displayed in a different way
             * from the rest of the filters.
             *  - If there is no saved_search in the filters, continue with the normal filters (else)
             *  - If there is a saved search:
             *  - - set it in the scope : this is what we will use to display the saved search and its filters in the UI
             *  - - get clean version (no defaults) of the saved search filters
             *  - - get a clean activeFilters array that does not include the saved search filters. $scope.activeFilters: this
             *  is the array we will be using to show the "extra" filters the user can set AFTER they selected  a saved search
             *  (keep in mind that when a saved search is selected all filters are erased in favor of the saved search)
             *  - - - Diffing rules: value from activeFilters takes priority over value from search. this is because
             *  the user will always have selected the value after they select a saved search,meaning they want to change it.
             *  - - - Diffing rules: if the value is equal, just ignore it/send empty value.
             *  - - - Diffing rules: return the _difference if the value is not equal, because we will want to show for instance:
             *  saved search: tag id 1 + filters tag id 2 (so it's not just ignoring the arrays)
             */
            if ($scope.savedSearch) {
                /**
                 * to handle removal correctly we need to make sure we take currentFilters (which has up to date info) into account,
                 * because that is where our savedsearch filters will stop being represented when we remove them.
                 * If there's a key in our current filters that is in the saved search but is not in the active filters at this point,
                 * it is because it was removed (since before saved search gets assigned, they are all assigned to the filters)
                 * that means we have to remove it from the saved search.
                 **/
                $scope.savedSearch.filter = PostFilters.cleanRemovedValuesFromSavedSearch(filters, PostFilters.getCleanActiveFilters($scope.savedSearch.filter));
                _.each(activeFilters, function (value, key) {
                    if (!_.isArray(activeFilters[key]) && !$scope.savedSearch.filter[key]) {
                        $scope.activeFilters[key] = activeFilters[key];
                    } else if (!_.isArray(activeFilters[key])) {
                        if ($scope.activeFilters[key]) {
                            delete $scope.activeFilters[key];
                        }
                    } else {
                        $scope.activeFilters[key] =  _.difference(value, $scope.savedSearch.filter[key]);
                    }
                });
                $scope.userCanUpdateSavedSearch = _.contains($scope.savedSearch.allowed_privileges, 'update') && !_.isEqual($scope.savedSearch.filter, filters);
            } else {
                $scope.userCanUpdateSavedSearch = false;
                $scope.activeFilters = activeFilters;
            }
        }

        function transformFilterValue(value, key) {
            if (FilterTransformers.transformers[key]) {
                return FilterTransformers.transformers[key](value);
            }
            return value;
        }

        function removeFilter(filterKey, value, savedSearch, $event) {
            $event.preventDefault();
            $event.stopPropagation();
            if (savedSearch) {
                savedSearch.filter = PostFilters.clearFilterFromArray(filterKey, value, savedSearch.filter);
                PostFilters.clearFilter(filterKey, value);
                PostFilters.setMode('savedsearch', savedSearch);
                $scope.savedSearch = savedSearch;
            } else {
                PostFilters.clearFilter(filterKey, value);
            }
        }

        function removeSavedSearch(savedSearch, $event) {
            $event.preventDefault();
            $event.stopPropagation();
            PostFilters.setMode('all', null);
            _.each(savedSearch.filter, function (filter, key) {
                if (_.isArray(filter)) {
                    _.each(filter, function (filterV, keyV) {
                        PostFilters.clearFilter(key, filterV);
                    });
                } else {
                    PostFilters.clearFilter(key, filter);
                }
            });
            $scope.savedSearch = null;
        }

        function showSaveSavedSearchButton() {
            return !_.isEmpty($scope.activeFilters) && !$scope.savedSearch;
        }

    }
}
