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
        scope.selectParent = selectParent;
        scope.selectChild = selectChild;

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
                            category.children = children;
                        });
                    }
                });
            });

            scope.$watch('selectedCategories', saveValueToView, true);
            ngModel.$render = renderModelValue;
        }
        function selectParent(parent) {
            if (_.contains(scope.selectedCategories, parent.id)) {
                _.each(parent.children, function (child) {
                    scope.selectedCategories.push(child.id);
                });
            } else {
                _.each(parent.children, function (child) {
                    scope.selectedCategories = _.filter (scope.selectedCategories, function (id) {
                        return id !== child.id;
                    });
                });
            }
        }

        function selectChild(child) {
            if (!_.contains(scope.selectedCategories, child.parent.id) && _.contains(scope.selectedCategories, child.id)) {
                scope.selectedCategories.push(child.parent.id);
            }
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
