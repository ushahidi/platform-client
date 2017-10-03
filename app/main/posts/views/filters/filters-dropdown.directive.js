module.exports = FiltersDropdown;

FiltersDropdown.$inject = ['PostFilters'];
function FiltersDropdown(PostFilters) {
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
            filtersDropdownToggle: '=',
            applyFilters: '=',
            filtersVar: '=',
            cancel: '=',
            reactiveFilters: '='
        },
        link: FiltersDropdownLink,
        template: require('./filters-dropdown.html')
    };

    function FiltersDropdownLink($scope, $element, $attrs, ngModel) {
        /** $scope.filtersVarLocked = angular.copy($scope.filtersVar);**/
        $scope.reactiveFilters = false;
        $scope.applyFiltersLocked = function () {
            console.log(3 + '- ' + $scope.reactiveFilters.toString());
            $scope.reactiveFilters = true;
            /*ngModel.$setViewValue(angular.copy($scope.filtersVar));
            PostFilters.setFilters($scope.filtersVar);*/
        };
    }

}

