module.exports = FormSelectDirective;

FormSelectDirective.$inject = ['FormEndpoint'];
function FormSelectDirective(FormEndpoint) {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        require: 'ngModel',
        link: FormSelectLink,
        template: require('./filter-form.html')
    };

    function FormSelectLink(scope, element, attrs, ngModel) {
        scope.checkAll = true;
        if (!ngModel) {
            return;
        }

        scope.forms = [];
        scope.selectedForms = [];
        scope.toggleAll = toggleAll;
        activate();
        function toggleAll() {
            if (!scope.checkAll) {
                scope.checkAll = true;
                Array.prototype.splice.apply(scope.selectedForms, [0, scope.selectedForms.length].concat(scope.forms.map(f => f.id).concat('none')));
            } else {
                scope.checkAll = false;
                Array.prototype.splice.apply(scope.selectedForms, [0, scope.selectedForms.length]);
            }
        }
        function activate() {
            // Load forms
            scope.forms = FormEndpoint.query();

            scope.$watch('selectedForms', saveValueToView, true);
            scope.$watch(() => ngModel.$viewValue, renderModelValue, true);
            ngModel.$render = renderModelValue;
        }
        function renderModelValue() {
            // Update selectedForms w/o breaking references used by checklist-model
            Array.prototype.splice.apply(scope.selectedForms, [0, scope.selectedForms.length].concat(ngModel.$viewValue));
        }

        function saveValueToView(selectedForms) {
            // the length +1 check is because we add 'none' through ng-models for unknown survey type (messages with no post)
            // this "fixes" the usecase where the user manually selected/unselected all checkboxes
            const sameValues = selectedForms.length === scope.forms.length + 1;
            if (!sameValues && scope.checkAll === true) {
                scope.checkAll = false;
            } else if (sameValues && scope.checkAll === false) {
                scope.checkAll = true;
            }
            ngModel.$setViewValue(angular.copy(selectedForms));
        }
    }
}

