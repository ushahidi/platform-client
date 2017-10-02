module.exports = FilterUnlockedOnTopDirective;

FilterUnlockedOnTopDirective.$inject = [
    'moment',
    '$rootScope',
    '_',
    'PostActiveOrderOptions'
];
function FilterUnlockedOnTopDirective(moment, $rootScope, _, PostActiveOrderOptions) {
    return {
        restrict: 'E',
        require: 'ngModel',
        template: require('./filter-unlocked-on-top.html'),
        scope: {},
        link: FilterUnlockedOnTopDirectiveLink
    };
    function FilterUnlockedOnTopDirectiveLink($scope, $element, $attrs, ngModel) {
        function activate() {
            $scope.unlockedOnTop = PostActiveOrderOptions.getDefinition().unlockedOnTop;
        }
        activate();
        $scope.$watch('unlockedOnTop', saveToView, true);
        function saveToView(unlockedOnTop) {
            ngModel.$setViewValue(angular.copy(unlockedOnTop));
        }
    }
}
