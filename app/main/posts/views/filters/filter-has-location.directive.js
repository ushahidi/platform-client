
module.exports = FilterHasLocationDirective;

FilterHasLocationDirective.$inject = [];

function FilterHasLocationDirective() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            hasLocation: '='
        },
        require: 'ngModel',
        link: FilterHasLocationLink,
        template: require('./filter-has-location.html')
    };
}

function FilterHasLocationLink($scope, $element, $attrs, ngModel) {
    activate();
    function activate() {
        $scope.$watch('hasLocation', saveToView, true);
    }

    function saveToView(hasLocation) {
        ngModel.$setViewValue(angular.copy(hasLocation));
    }
}
