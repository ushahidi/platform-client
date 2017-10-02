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
            cancel: '='
        },
        link: FiltersDropdownLink,
        template: require('./filters-dropdown.html')
    };

    function FiltersDropdownLink($scope, $element, $attrs, ngModel) {
        $scope.filtersVarLocked = angular.copy($scope.filtersVar);
        // console.log($scope.filtersVar, $scope.filtersVarLocked);
        $scope.applyFiltersLocked = function () {
            $scope.filtersVar = $scope.filtersVarLocked;
            ngModel.$setViewValue(angular.copy($scope.filtersVar));
            PostFilters.setFilters($scope.filtersVar);
            //console.log($scope.filtersVarLocked, $scope.filtersVar);
        };
    }

}

