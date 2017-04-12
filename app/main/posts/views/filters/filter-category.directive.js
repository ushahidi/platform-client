module.exports = CategorySelectDirective;

CategorySelectDirective.$inject = ['TagEndpoint', '_'];
function CategorySelectDirective(TagEndpoint, _) {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        require: 'ngModel',
        link: CategorySelectLink,
        template: require('./filter-category.html')
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
            TagEndpoint.query().$promise.then(function (result) {
                scope.categories = result;
                // adding children to tags
                _.each(scope.categories, function (category) {
                    if (category.children) {
                        var children = [];
                        _.each(category.children, function (child) {
                            _.each(scope.categories, function (category) {
                                if (category.id === parseInt(child.id)) {
                                    children.push(category);
                                }
                            });
                        });
                    }
                });
            });

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
