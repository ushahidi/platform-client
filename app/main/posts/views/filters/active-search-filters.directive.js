module.exports = ActiveSearchFilters;

ActiveSearchFilters.$inject = ['$translate', '$filter', 'PostFilters', '_', 'FilterTransformers', '$rootScope', 'ModalService', 'SavedSearchEndpoint'];
function ActiveSearchFilters($translate, $filter, PostFilters, _, FilterTransformers, $rootScope, ModalService, SavedSearchEndpoint) {
    return {
        restrict: 'E',
        scope: true,
        require: 'ngModel',
        template: require('./active-search-filters.html'),
        link: ActiveFiltersLink
    };

    function ActiveFiltersLink($scope, ngModel) {
        $scope.activeFilters = {};
        $scope.removeFilter = removeFilter;
        $scope.transformFilterValue = transformFilterValue;
        $scope.removeSavedSearch = removeSavedSearch;
        $scope.userCanUpdateSavedSearch = false;
        $scope.activeFiltersOnSavedSearch = false;
        $scope.isArray = angular.isArray;
        $scope.$watch(PostFilters.getModeId, function (newValue, oldValue) {
            if (oldValue !== newValue || (!$scope.userCanUpdateSavedSearch)) {
                setSavedSearchUpdateStatus();
            }
        });

        $scope.saveSavedSearchModal = function() {
            let savedSearch = {
                view : 'map',
                role : []
            };
            savedSearch.filter = $scope.filtersVar;
            // @TODO Prevent the user from creating one if they somehow manage to get to this point without being logged in
            savedSearch.user_id = $rootScope.currentUser ? $rootScope.currentUser.userId : null;
            $scope.copySavedSearch = savedSearch
            ModalService.openTemplate('<saved-search-editor saved-search="copySavedSearch"></saved-search-editor>', 'set.create_savedsearch', 'star', $scope, false, false);
        };

        $scope.activeFiltersAreEmpty = function() {
            console.log($scope.activeFilters)
            if (_.isEmpty($scope.activeFilters)) {
                return true;
            } else if (activeFiltersHaveNoValues()) {
                return true;
            } else {
                return false;
            }
        }

        function activeFiltersHaveNoValues() {
            let filtersHaveNoValue = true;
            _.each($scope.activeFilters, function(value, key, obj){
                if (Array.isArray(value) && value.length || !Array.isArray(value) && value === undefined) {
                    filtersHaveNoValue = false
                } 
            })
            return filtersHaveNoValue;
        }
        // Check if we can edit
        function setSavedSearchUpdateStatus() {
            var savedSearchId = PostFilters.getModeId();
            if (savedSearchId) {
                SavedSearchEndpoint.get({id: savedSearchId}, function (savedSearch) {
                    $scope.userCanUpdateSavedSearch = _.contains(savedSearch.allowed_privileges, 'update');
                });
            }
        }

        activate();

        function activate() {
            FilterTransformers.requestsFiltersData().then(function (all) {
                $scope.$watch(function () {
                    return PostFilters.getActiveFilters(PostFilters.getFilters());
                }, handleFiltersUpdate, true);
            });
        }

        function makeArray(value) {
            if (!angular.isArray(value)) {
                return [value];
            }
            return value;
        }

        function handleFiltersUpdate(filters) {
            var activeFilters = angular.copy(PostFilters.getCleanActiveFilters(filters));
            FilterTransformers.rawFilters = angular.copy(filters);
            // Remove set filter as it is only relevant to collections and should be immutable in that view
            delete activeFilters.set;
            $scope.savedSearch = null;
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
             *  - - - Diffing rules: if the value is a number or string, return Value because it is a priority (the one from filters not from saved search)
             *  - - - Diffing rules: return the _difference if the value is not equal, not a number or not a string, because we will want to show for isntance:
             *  saved search: tag id 1 + filters tag id 2 (so it's not just ignoring the arrays)
             */
            if (filters.saved_search) {
                $scope.savedSearch = angular.copy(filters.saved_search);
                // get clean version (no defaults) of the saved search filters
                $scope.savedSearch.filter = PostFilters.getCleanActiveFilters(filters.saved_search.filter);
                $scope.activeFiltersOnSavedSearch = !$scope.activeFiltersAreEmpty
                $scope.activeFilters = _.mapObject(_.mapObject(activeFilters, function (value, key) {
                    if (value === $scope.savedSearch.filter[key]) {
                        return [];
                    }
                    if (_.isNumber(value) || _.isString(value)) {
                        return value;
                    }
                    return _.difference(value, $scope.savedSearch.filter[key]);
                }), makeArray);
            } else {
                $scope.activeFilters =  _.mapObject(activeFilters, makeArray);
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
                $scope.savedSearch.filter = PostFilters.clearFilterFromArray(filterKey, value, $scope.savedSearch.filter);
            } else {
                PostFilters.clearFilter(filterKey, value);
            }
        }
        function removeSavedSearch(savedSearch, $event) {
            $event.preventDefault();
            $event.stopPropagation();
            PostFilters.clearFilter('saved_search', savedSearch);

            _.each(savedSearch.filter, function (filter, key) {
                if (_.isArray(filter)) {
                    _.each(filter, function (filterV, keyV) {
                        PostFilters.clearFilter(key, filterV);
                    });
                } else {
                    PostFilters.clearFilter(key, filter);
                }
            });
            $scope.savedSearch.filter = [];
            $scope.savedSearch = null;

        }
    }
}
