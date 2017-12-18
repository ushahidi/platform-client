module.exports = FilterUnlockedOnTopDirective;

FilterUnlockedOnTopDirective.$inject = [
    '_'
];
function FilterUnlockedOnTopDirective(_) {
    return {
        restrict: 'E',
        require: 'ngModel',
        template: require('./filter-unlocked-on-top.html'),
        scope: {},
        link: FilterUnlockedOnTopDirectiveLink
    };
    function FilterUnlockedOnTopDirectiveLink($scope, $element, $attrs, ngModel) {
        $scope.unlockedOnTop = {
            value: 'true',
            labelTranslateKey: 'global_filter.sort.unlockedOnTop.filter_type_tag'
        };

        function activate() {
            ngModel.$render = renderModelValue;
            $scope.$watch('unlockedOnTop', saveToView, true);
        }

        function renderModelValue() {
            $scope.unlockedOnTop = {
                value: ngModel.$viewValue,
                labelTranslateKey: 'global_filter.sort.unlockedOnTop.filter_type_tag'
            };
        }
        activate();
        function saveToView(unlockedOnTop) {
            ngModel.$setViewValue(angular.copy(unlockedOnTop ? unlockedOnTop.value.toString() : ''));
        }
    }
}
