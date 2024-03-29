module.exports = SourceSelectDirective;

SourceSelectDirective.$inject = ['$rootScope', 'CONST'];
function SourceSelectDirective($rootScope, CONST) {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        require: 'ngModel',
        link: SourceSelectLink,
        template: require('./filter-source.html')
    };

    function SourceSelectLink(scope, element, attrs, ngModel) {
        scope.isAmongEnabledSources = function (source) {
            return CONST.ENABLED_SOURCES.some(e_source => e_source === source);
        };
        scope.selectedSources = [];
        scope.hasPermission = $rootScope.hasPermission;

        activate();

        function activate() {
            scope.$watch('selectedSources', saveValueToView, true);
            scope.$watch(() => ngModel.$viewValue, renderModelValue, true);
            ngModel.$render = renderModelValue;
        }

        function renderModelValue() {
            // Update selectedSources w/o breaking references used by checklist-model
            Array.prototype.splice.apply(scope.selectedSources, [0, scope.selectedSources.length].concat(ngModel.$viewValue));
        }

        function saveValueToView(selectedSources) {
            ngModel.$setViewValue(angular.copy(selectedSources));
        }
    }
}
