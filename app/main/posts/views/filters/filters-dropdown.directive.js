module.exports = FiltersDropdown;

FiltersDropdown.$inject = [];
function FiltersDropdown() {
    return {
        restrict: 'E',
        scope: {
            filtersDropdownToggle: '=',
            applyFilters: '=',
            filtersVar: '=',
            cancel: '='
        },
        link: FiltersDropdownLink,
        template: require('./filters-dropdown.html')
    };
}


function FiltersDropdownLink($scope, $element, $attrs) {
    console.log($scope.filtersVar);
}

