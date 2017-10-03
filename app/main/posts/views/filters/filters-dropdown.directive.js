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
        console.log('init directive');
        PostFilters.reactiveFilters = 'disabled';
        $scope.applyFiltersLocked = function () {
            console.log('ractivefilters', PostFilters.reactiveFilters);
            PostFilters.reactiveFilters = 'enabled';
        };
    }

}

