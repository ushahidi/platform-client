module.exports = ActiveSearchFilters;

ActiveSearchFilters.$inject = ['$translate', '$filter', 'PostFilters', '_', 'FilterTransformers', '$rootScope'];
function ActiveSearchFilters($translate, $filter, PostFilters, _, FilterTransformers, $rootScope) {
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
        $scope.collection = PostFilters.getModeEntity('collection');
        var originalSavedSearch;
        $scope.removeFilter = removeFilter;
        $scope.transformFilterValue = transformFilterValue;
        $scope.removeSavedSearch = removeSavedSearch;
        $scope.removeCollection = removeCollection;
        $scope.showSaveSavedSearchButton = showSaveSavedSearchButton;
        $scope.userCanUpdateSavedSearch = false;

        activate();

        $scope.isArray = angular.isArray;

        function activate() {
            /**
             * we need to listen for saved searches and collections update events
             * so that we are notified when a user changes a collection or
             * saved search
             */
            $scope.$on('savedSearch:update', function () {
                handleFiltersUpdate(PostFilters.getActiveFilters(PostFilters.getFilters()), null, true);
            });
            $scope.$on('collection:update', function () {
                handleFiltersUpdate(PostFilters.getActiveFilters(PostFilters.getFilters()), null, true);
            });
            /**
             * we don't have filters set when we are on a collection
             * so we need to watch for collection mode changes specifically instead of relying on the filters
             * changing like we do for saved searches
             */
            $scope.$watch(function () {
                return PostFilters.getModeId();
            }, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    if (PostFilters.getMode() === 'collection') {
                        $scope.collection = PostFilters.getModeEntity('collection');
                        $scope.savedSearch = null;
                        originalSavedSearch = null;
                    }
                    // Other modes should be handled elsewhere
                }
            }, true);

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
            // delete currentFilters.set;
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
            else if (resetSearch === true || !$scope.savedSearch || originalSavedSearch.id !== PostFilters.getModeId()) {
                $scope.collection = null;
                originalSavedSearch = angular.copy(PostFilters.getModeEntity('savedsearch'));
                $scope.savedSearch = PostFilters.getModeEntity('savedsearch');
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
                var originalSavedSearchFilters = PostFilters.getUIActiveFilters(originalSavedSearch.filter);
                $scope.savedSearch.filter = getUISavedSearchFilters($scope.savedSearch.filter, originalSavedSearchFilters, $scope.uiFilters, filters);
                var savedSearchFiltersChanged = filtersHaveDifferences(originalSavedSearchFilters, $scope.savedSearch.filter);
                var filtersDifferentToSavedSearch = filtersHaveDifferences(filters, $scope.savedSearch.filter);
                $scope.userCanUpdateSavedSearch = _.contains($scope.savedSearch.allowed_privileges, 'update') && (savedSearchFiltersChanged || filtersDifferentToSavedSearch);
                // remove values that are in the saved search from the uifilters.
                $scope.uiFilters = PostFilters.cleanUIFilters($scope.uiFilters, $scope.savedSearch.filter);
            }
        }

        function getUISavedSearchFilters(savedSearchFilters, originalSavedSearchFilters, uiFilters, filters) {
            savedSearchFilters = PostFilters.getUIActiveFilters(savedSearchFilters);
            /**
             * to handle removal correctly we need to make sure we take currentFilters (which has up to date info) into account,
             * because that is where our savedsearch filters will stop being represented when we remove them.
             * If there's a key in our current filters that is in the saved search but is not in the active filters at this point,
             * it is because it was removed (since before saved search gets assigned, they are all assigned to the filters)
             * that means we have to remove it from the saved search.
             **/
            savedSearchFilters = PostFilters.cleanRemovedValuesFromObject(filters, savedSearchFilters);
            /**
             * Add back in savedSearch.filter if an originally saved search filter is removed+added back
             */
            var uiSavedSearchActiveFilters = PostFilters.getUIActiveFilters(savedSearchFilters);
            var uiOriginalSavedSearchFilters = PostFilters.getUIActiveFilters(originalSavedSearchFilters);
            var uiActiveFilters = PostFilters.getUIActiveFilters(uiFilters);
            var cleanSavedSearchFilters = PostFilters.addIfCurrentObjectMatchesOriginal(uiSavedSearchActiveFilters, uiOriginalSavedSearchFilters, uiActiveFilters);
            // get clean version (no defaults) of the saved search filters after processing it with addIfCurrentObjectMatchesOriginal
            return PostFilters.getUIActiveFilters(cleanSavedSearchFilters);
        }

        function filtersHaveDifferences(original, current) {
            return _.filter(original, function (obj, key) {
                if (!_.isArray(obj)) {
                    return current[key] !== obj;
                } else {
                    return _.difference(current[key], obj).length !== 0 || _.difference(obj, current[key]).length !== 0 ;
                }
            }).length > 0 ;
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
                $scope.savedSearch = savedSearch;
            } else {
                PostFilters.clearFilter(filterKey, value);
            }
        }

        function removeSavedSearch(savedSearch, $event) {
            $event.preventDefault();
            $event.stopPropagation();
            originalSavedSearch = null;
            $scope.savedSearch = null;
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
        }

        function removeCollection(collection, $event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.collection = null;
            PostFilters.setMode('all', null);
            /**
             * because the default for collections is different than the default for
             * other modes, we need to explicitly reset the filters or it will be shown
             * as if we had manually set the collection status defaults [published, draft, archived]
             */
            PostFilters.setFilter('status', PostFilters.getDefaults().status);
        }

        // collections should not be saved within a saved search
        function showSaveSavedSearchButton() {
            return !$scope.collection && !_.isEmpty($scope.uiFilters) && !$scope.savedSearch && $rootScope.loggedin;
        }

    }
}
