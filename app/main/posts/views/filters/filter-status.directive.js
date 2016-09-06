module.exports = StatusSelectDirective;

StatusSelectDirective.$inject = ['PostActionsService', '$rootScope'];
function StatusSelectDirective(PostActionsService, $rootScope) {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        require: 'ngModel',
        link: StatusSelectLink,
        template: require('./filter-status.html')
    };

    function StatusSelectLink(scope, element, attrs, ngModel) {
        scope.statuses = PostActionsService.getStatuses();
        scope.selectedStatuses = [];
        scope.hasPermission = $rootScope.hasPermission;

        activate();

        function activate() {
            scope.$watch('selectedStatuses', saveValueToView, true);
            ngModel.$render = renderModelValue;
        }

        function renderModelValue() {
            // Update selectedStatuses w/o breaking references used by checklist-model
            Array.prototype.splice.apply(scope.selectedStatuses, [0, scope.selectedStatuses.length].concat(ngModel.$viewValue));
        }

        function saveValueToView(selectedStatuses) {
            ngModel.$setViewValue(angular.copy(selectedStatuses));
        }
    }
}
