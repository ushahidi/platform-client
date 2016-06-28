module.exports = FormSelectDirective;

FormSelectDirective.$inject = ['FormEndpoint'];
function FormSelectDirective(FormEndpoint) {
    return {
        restrict: 'E',
        scope: {},
        require: 'ngModel',
        link: FormSelectLink,
        templateUrl: 'templates/posts/views/filters/filter-form.html'
    };

    function FormSelectLink(scope, element, attrs, ngModel) {
        if (!ngModel) {
            return;
        }

        scope.forms = [];
        scope.selectedForms = [];

        activate();

        function activate() {
            // Load forms
            scope.forms = FormEndpoint.query();

            scope.$watch('selectedForms', saveValueToView, true);
            ngModel.$render = renderModelValue;
        }

        function renderModelValue() {
            // Update selectedForms w/o breaking references used by checklist-model
            Array.prototype.splice.apply(scope.selectedForms, [0, scope.selectedForms.length].concat(ngModel.$viewValue));
        }

        function saveValueToView(selectedForms) {
            ngModel.$setViewValue(angular.copy(selectedForms));
        }
    }
}

