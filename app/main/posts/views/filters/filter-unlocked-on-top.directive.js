module.exports = FilterUnlockedOnTopDirective;

FilterUnlockedOnTopDirective.$inject = [
    'moment',
    '$rootScope',
    '_'
];
function FilterUnlockedOnTopDirective(moment, $rootScope, _) {
    return {
        restrict: 'E',
        require: 'ngModel',
        template: require('./filter-unlocked-on-top.html'),
        scope: {},
        link: FilterUnlockedOnTopDirectiveLink
    };
    function FilterUnlockedOnTopDirectiveLink($scope, $element, $attrs, ngModel) {
        $scope.unlockedOnTop = {
            value: false,
            labelTranslateKey: 'global_filter.sort.unlockedOnTop.filter_type_tag'
        };
        $scope.$watch('unlockedOnTop', saveToView, true);
        function saveToView(unlockedOnTop) {
            ngModel.$setViewValue(angular.copy(unlockedOnTop ? unlockedOnTop.value.toString() : ''));
        }
    }
}
