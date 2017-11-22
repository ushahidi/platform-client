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
        $scope.uiFilters = {};
        $scope.savedSearch = null;
        var originalSavedSearch;
        $scope.removeFilter = removeFilter;
        $scope.transformFilterValue = transformFilterValue;
        $scope.removeSavedSearch = removeSavedSearch;
        $scope.showSaveSavedSearchButton = showSaveSavedSearchButton;
        $scope.userCanUpdateSavedSearch = false;

        activate();
        $scope.$on('savedSearch:update', function () {
            handleFiltersUpdate(PostFilters.getActiveFilters(PostFilters.getFilters()), null, true);
        });

        $scope.isArray = angular.isArray;

        function activate() {
            FilterTransformers.requestsFiltersData().then(function (all) {
                $scope.$watch(function () {
                    return PostFilters.getActiveFilters(PostFilters.getFilters());
                }, handleFiltersUpdate, true);
            });
        }

        function handleFiltersUpdate(filters, oldValue, resetSearch) {
            var currentFilters = angular.copy(PostFilters.getUIActiveFilters(filters));
            FilterTransformers.rawFilters = angular.copy(filters);
            // Remove set filter as it is only relevant to collections and should be immutable in that view
            delete currentFilters.set;
            var isModeSavedSearch = PostFilters.getMode() === 'savedsearch';
            // if we are not in a saved search, make sure to reset the original and the scope saved search
            if (!isModeSavedSearch) {
                $scope.savedSearch = null;
                originalSavedSearch = null;
            }
            /** if there is not yet a savedSearch selected or if it is a different one than the selected,
             setup the originalSavedSearch (which NEVER changes) and the savedSearch, which changes
             and is used for showing the filters as the user adds/removes filters
             **/

            if (resetSearch === true || !$scope.savedSearch || originalSavedSearch.id !== PostFilters.getModeId()) {
                originalSavedSearch = angular.copy(PostFilters.getModeEntity());
                $scope.savedSearch = PostFilters.getModeEntity();
            }
            /**
             * This handles the requirement to have saved search filters displayed in a different way
             * from the rest of the filters.
             *  - If there is a saved search:
             *  - - set it in the scope: this is what we will use to display the saved search and its filters in the UI
             *  - - get clean version (no defaults) of the saved search filters
             *  - - get a clean currentFilters array that does not include the saved search filters. $scope.uiFilters: this
             *  is the array we will be using to show the "extra" filters the user can set AFTER they selected  a saved search
             *  (keep in mind that when a saved search is selected all filters are erased in favor of the saved search)
             *  - - - Diffing rules: value from currentFilters takes priority over value from search. this is because
             *  the user will always have selected the value after they select a saved search,meaning they want to change it.
             *  - - - Diffing rules: if the value is equal, just ignore it/send empty value.
             *  - - - Diffing rules: return the _difference if the value is not equal, because we will want to show for instance:
             *  saved search: tag id 1 + filters tag id 2 (so it's not just ignoring the arrays)
             */
            $scope.userCanUpdateSavedSearch = false;
            $scope.uiFilters = currentFilters;

            if ($scope.savedSearch) {
                /**
                 * to handle removal correctly we need to make sure we take currentFilters (which has up to date info) into account,
                 * because that is where our savedsearch filters will stop being represented when we remove them.
                 * If there's a key in our current filters that is in the saved search but is not in the active filters at this point,
                 * it is because it was removed (since before saved search gets assigned, they are all assigned to the filters)
                 * that means we have to remove it from the saved search.
                 **/
                $scope.savedSearch.filter = PostFilters.cleanRemovedValuesFromObject(filters, PostFilters.getUIActiveFilters($scope.savedSearch.filter));
                console.log($scope.savedSearch.filter);
                /**
                 * Add back in savedSearch.filter if an originally saved search filter is removed+added back
                 */
                $scope.savedSearch.filter = PostFilters.getUIActiveFilters(PostFilters.addIfCurrentObjectMatchesOriginal(PostFilters.getUIActiveFilters($scope.savedSearch.filter), PostFilters.getUIActiveFilters(originalSavedSearch.filter), PostFilters.getUIActiveFilters($scope.uiFilters)));
                console.log($scope.savedSearch.filter);
                var savedSearchFiltersChanged = !_.isEqual($scope.savedSearch.filter, PostFilters.getUIActiveFilters(originalSavedSearch.filter));
                var filtersDifferentToSavedSearch = !_.isEqual($scope.savedSearch.filter, filters);
                $scope.userCanUpdateSavedSearch = _.contains($scope.savedSearch.allowed_privileges, 'update') && (savedSearchFiltersChanged || filtersDifferentToSavedSearch);
                _.each($scope.uiFilters, function (value, key) {
                    if (!_.isArray(currentFilters[key]) && !$scope.savedSearch.filter[key]) {
                        $scope.uiFilters[key] = currentFilters[key];
                    } else if (!_.isArray(currentFilters[key])) {
                        if ($scope.uiFilters[key]) {
                            delete $scope.uiFilters[key];
                        }
                    } else {
                        $scope.uiFilters[key] =  _.difference(value, $scope.savedSearch.filter[key]);
                    }
                });

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
                // commented - if we do this here we can' compare for removal and know that it's updated
                // savedSearch.filter = PostFilters.clearFilterFromArray(filterKey, value, savedSearch.filter);
                PostFilters.clearFilter(filterKey, value);
                // commented - if we do this here we can' compare for removal and know that it's updated
                // PostFilters.setMode('savedsearch', savedSearch);
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
            return !_.isEmpty($scope.uiFilters) && !$scope.savedSearch;
        }

    }
}
