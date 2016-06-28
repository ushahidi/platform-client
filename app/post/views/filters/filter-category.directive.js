module.exports = CategorySelectDirective;

CategorySelectDirective.$inject = ['TagEndpoint'];
function CategorySelectDirective(TagEndpoint) {
    return {
        restrict: 'E',
        scope: {},
        require: 'ngModel',
        link: CategorySelectLink,
        templateUrl: 'templates/posts/views/filters/filter-category.html'
    };

    function CategorySelectLink(scope, element, attrs, ngModel) {
        if (!ngModel) {
            return;
        }

        scope.categories = [];
        scope.selectedCategories = [];

        activate();

        function activate() {
            // Load categories
            scope.categories = TagEndpoint.query();

            scope.$watch('selectedCategories', saveValueToView, true);
            ngModel.$render = renderModelValue;
        }

        function renderModelValue() {
            // Update selectCategories w/o breaking references used by checklist-model
            Array.prototype.splice.apply(scope.selectedCategories, [0, scope.selectedCategories.length].concat(ngModel.$viewValue));
        }

        function saveValueToView(selectedCategories) {
            ngModel.$setViewValue(angular.copy(selectedCategories));
        }
    }
}
