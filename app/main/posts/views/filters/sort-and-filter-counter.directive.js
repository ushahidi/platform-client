module.exports = SortAndFilterCounterDirective;

SortAndFilterCounterDirective.$inject = ['PostFilters'];
function SortAndFilterCounterDirective(PostFilters) {
    return {
        restrict: 'E',
        scope: {
            filters: '='
        },
        link: SortAndFilterCounterDirectiveLink,
        template: require('./sort-and-filter-counter.html')
    };

    function SortAndFilterCounterDirectiveLink($scope, $element, $attrs, ngModel) {
        $scope.$watch(function () {
            return PostFilters.countFilters();
        }, handleFiltersUpdate, true);

        function handleFiltersUpdate() {
            $scope.filtersCount = PostFilters.countFilters($scope.filters);
        }
    }

}

