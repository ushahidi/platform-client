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
        PostFilters.reactiveFilters = 'disabled';
        $scope.applyFiltersLocked = function () {
            PostFilters.reactiveFilters = 'enabled';
        };
        $scope.clearFilters = function () {
            $scope.filtersVar = PostFilters.clearFilters();
        };
    }

}

