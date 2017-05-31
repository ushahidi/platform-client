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
        scope.parents = [];
        scope.selectedCategories = [];
        activate();

        function activate() {
            // Load categories
            TagEndpoint.queryFresh().$promise.then(function (result) {
                scope.categories = result;
                // adding children to tags
                _.each(scope.categories, function (category) {
                    if (category.children) {
                        var children = [];
                        _.each(category.children, function (child) {
                            _.each(scope.categories, function (childObj) {
                                if (childObj.id === parseInt(child.id)) {
                                    children.push(childObj);
                                }
                            });
                            category.children = children;
                        });
                    }
                });
                // separating parents from children
                scope.parents = _.filter(scope.categories, function (category) {
                    if (category.parent_id === null) {
                        return category;
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
            var selected = [];
            // removing children that has no parent selected
            _.each(scope.categories, function (category) {
                        if (category.parent && _.contains(selectedCategories, category.id) && _.contains(selectedCategories, category.parent.id)) {
                            selected.push(category.id);
                        } else if (category.parent_id === null && _.contains(selectedCategories, category.id)) {
                            selected.push(category.id);
                        }
                    });
            ngModel.$setViewValue(angular.copy(selected));
        }
    }
}
