module.exports = ActiveFilters;

ActiveFilters.$inject = ['$translate', '$filter', 'PostFilters', '_', 'FilterTransformers'];
function ActiveFilters($translate, $filter, PostFilters, _, FilterTransformers) {
    return {
        restrict: 'E',
        scope: true,
        template: require('./active-filters.html'),
        link: ActiveFiltersLink
    };

    function ActiveFiltersLink($scope) {
        $scope.activeFilters = {};
        $scope.removeFilter = removeFilter;
        $scope.transformFilterValue = transformFilterValue;
        activate();

        function activate() {
            $scope.$watch(function () {
                return PostFilters.getActiveFilters(PostFilters.getFilters());
            }, handleFiltersUpdate, true);
            FilterTransformers.requestsFiltersData();
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
            // Remove form filter as its shown by the mode-context-form-filter already,
            // exception: if user only wants to see incoming messages (activeFilters.form = ['none']), we keep the form-filter.
            if (!_.isEqual(activeFilters.form, ['none'])) {
                delete activeFilters.form;
            }
            // Remove categories since its shown by the mode-context-form-filter already
            if (filters.form && filters.form.length <= 1) {
                delete activeFilters.tags;
            }
            // Remove within_km as its shown with the center_point value
            delete activeFilters.within_km;
            $scope.activeFilters = _.mapObject(activeFilters, makeArray);
        }

        function transformFilterValue(value, key) {
            if (FilterTransformers.transformers[key]) {
                return FilterTransformers.transformers[key](value);
            }
            return value;
        }

        function removeFilter(filterKey, value) {
            PostFilters.clearFilter(filterKey, value);
        }
    }
}
