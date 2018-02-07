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

        function saveValueToView(selectedCategories) {
            selectedCategories = handleParents(selectedCategories);
            ngModel.$setViewValue(angular.copy(selectedCategories), ngModel.$viewValue);
        }
        // unselect children when parent is unselected and all children are selected

        // current result arrays when I unselect a parent with children
        // selectedCategories > [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12]
        // ngModel.$viewValue > [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        // current results in this after processing >  [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12]
        // SHOULD be:  [1, 2, 3, 5, 6, 9, 10, 11, 12] (which means, unselect children [7, 8]
        function handleParents(newSelection, old) {
            let result = angular.copy(newSelection);
            const findRemoved = _.difference(ngModel.$viewValue, newSelection);
            const findAdded = _.difference(newSelection, ngModel.$viewValue);
            const parentsRemoved = _.filter(findRemoved, (category) => { // return parents that were removed
                return isParent(category);
            });

            if (findRemoved.length > 0 && parentsRemoved.length > 0) {
                _.each(parentsRemoved, (parent) => {
                    const toReject = allChildrenToUnselect(parent);
                    result = _.without(result, ...toReject);
                });
            } else if (findAdded.length > 0) {
                _.each(newSelection, (any) => {
                    const toAdd = childrenToReSelect(any);
                    if (toAdd.length > 0) {
                        result = result.concat(toAdd);
                    }
                });
            }
            return result;
        }

        function childrenToReSelect(parentId) {
            const parent = _.find(scope.parents, (category) => {
                return category.id === parentId;
            });
            return parent ? _.pluck(parent.children, 'id') : [];
        }

        function allChildrenToUnselect(parentId) {
            const children = _.find(scope.parents, (category) => {
                return category.id === parentId;
            }).children;
            return _.pluck(children, 'id');
        }

        function isParent(categoryId) {
            const parent = _.find(scope.parents, (category) => {
                return category.id === categoryId;
            });
            return !!parent;
        }
    }
}
