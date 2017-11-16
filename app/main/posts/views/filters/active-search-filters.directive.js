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
        $scope.removeFilter = removeFilter;
        $scope.transformFilterValue = transformFilterValue;
        $scope.removeSavedSearch = removeSavedSearch;
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
                $scope.activeFilters = _.mapObject(_.mapObject(activeFilters, function (value, key) {
                    if (value === $scope.savedSearch.filter[key]) {
                        return '';
                    }
                    if (_.isNumber(value) || _.isString(value)) {
                        return value;
                    }
                    return _.difference(value, $scope.savedSearch.filter[key]);
                }), makeArray);
                console.log($scope.activeFilters, $scope.savedSearch.filter);
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
