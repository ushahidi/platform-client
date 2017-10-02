module.exports = SortAndFilterCounterDirective;

SortAndFilterCounterDirective.$inject = ['PostFilters'];
function SortAndFilterCounterDirective(PostFilters) {
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
            filtersDropdownToggle: '=',
            applyFilters: '=',
            filtersVar: '=',
            cancel: '='
        },
        link: SortAndFilterCounterDirectiveLink,
        template: require('./filters-dropdown.html')
    };

    function SortAndFilterCounterDirectiveLink($scope, $element, $attrs, ngModel) {
        $scope.filtersVarLocked = angular.copy($scope.filtersVar);
    }

}

