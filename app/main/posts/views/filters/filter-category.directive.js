module.exports = CategorySelectDirective;

CategorySelectDirective.$inject = ['TagEndpoint', '_', 'CategorySelection'];
function CategorySelectDirective(TagEndpoint, _, CategorySelection) {
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
        scope.internallyModified = false;
        scope.internal = function () {
            scope.internallyModified = false;
        };

        activate();

        function activate() {
            // Load categories from server
            TagEndpoint.query().$promise.then(function (result) {
                scope.categories = result;
                // assign children to their parent categories
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
                // setting only the ids in the selectedCategories array
                if (!scope.selectedCategories || scope.selectedCategories.length === 0) {
                    scope.selectedCategories = _.pluck(scope.categories, 'id');
                }
            });

            scope.$watch('selectedCategories', saveValueToView, true);
            scope.$watch(() => ngModel.$viewValue, renderModelValue, true);
            ngModel.$render = renderModelValue;
        }
        function renderModelValue() {
            // TODO if we detect parents that used to have children now don't have a child selected, we should unselect them
            // TODO if we detect a child was unselected, we should unselect the parent
            // TODO if we find a previously unselected parent that is now selected, we need to re-select all the children in it
            // TODO if we find a previously selected parent that is now un-selected by a user action, we need to un-select all the children in it
            // Update selectCategories w/o breaking references used by checklist-model
            // scope.selectedCategories = handleParents(selectedCategories);

            if (ngModel.$viewValue) {
                Array.prototype.splice.apply(scope.selectedCategories, [0, scope.selectedCategories.length].concat(ngModel.$viewValue));
            }
        }

        function saveValueToView(selectedCategories, oldSelection) {
            const res = CategorySelection.handleParents(selectedCategories, oldSelection, scope);
            selectedCategories = res.result;
            scope.internallyModified = res.internallyModified;
            ngModel.$setViewValue(angular.copy(selectedCategories), ngModel.$viewValue);
        }
    }
}
