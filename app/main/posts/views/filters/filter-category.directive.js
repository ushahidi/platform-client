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
            selectedCategories = handleParents(selectedCategories, oldSelection);
            ngModel.$setViewValue(angular.copy(selectedCategories), ngModel.$viewValue);
        }
        // unselect children when parent is unselected and all children are selected

        // current result arrays when I unselect a parent with children
        // selectedCategories > [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12]
        // ngModel.$viewValue > [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        // current results in this after processing >  [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12]
        // SHOULD be:  [1, 2, 3, 5, 6, 9, 10, 11, 12] (which means, unselect children [7, 8]
        function handleParents(newSelection, oldSelection) {
            let result = angular.copy(newSelection);
            if (!scope.internallyModified) {
                result = childrenRemovedResult(newSelection, oldSelection, result);
            }
            if (!scope.internallyModified) {
                result = parentsRemovedResult(newSelection, oldSelection, result);
            }
            if (!scope.internallyModified) {
                result = parentsAddedResult(newSelection, oldSelection, result);
            }
            if (!scope.internallyModified) {
                result = childrenAllSelectedResult(newSelection, oldSelection, result);
            }
            return result;
        }

        // unselect parent if child was removed
        function childrenRemovedResult(newSelection, oldSelection, result) {
            const findRemoved = _.difference(oldSelection, newSelection);
            const childRemoved = _.filter(findRemoved, (category) => { // return parents that were removed
                return !isParent(category);
            });
            if (childRemoved.length > 0) {
                result = _.filter(result, (categoryId) => {
                    return categoryId !== parentToUnSelect(childRemoved[0]);
                });
                scope.internallyModified = true;
            }
            return result;
        }

        function parentsAddedResult(newSelection, oldSelection, result) {
            const findAdded = _.difference(newSelection, oldSelection);
            if (findAdded.length > 0 && isParent(findAdded[0])) {
                _.each(newSelection, (any) => {
                    const toAdd = childrenToReSelect(any);
                    if (toAdd.length > 0) {
                        result = _.uniq(result.concat(toAdd));
                        scope.internallyModified = true;
                    }
                });
            }
            return result;
        }

        function childrenAllSelectedResult(newSelection, oldSelection, result) {
            const findAdded = _.difference(newSelection, oldSelection);
            if (findAdded.length > 0) {
                // for each parent in scope.parents, check if ALL their children are selected if a parent is unselected
                _.each(scope.parents, (parentCategory) => {
                    const findParent = _.find(newSelection, (itm) => itm === parentCategory.id);
                    if (!findParent) {
                        const contained = _.every(_.pluck(parentCategory.children, 'id'), (childId) => {
                            return _.find(newSelection, (itm) => itm === childId);
                        });
                        if (contained) {
                            result = _.uniq(result.concat(parentCategory.id));
                            scope.internallyModified = true;
                        }
                    }
                });
            }
            return result;
        }

        function parentsRemovedResult(newSelection, oldSelection, result) {
            const findRemoved = _.difference(oldSelection, newSelection);
            const parentsRemoved = _.filter(findRemoved, (category) => { // return parents that were removed
                return isParent(category);
            });
            if (findRemoved.length > 0 && parentsRemoved.length > 0) {
                _.each(parentsRemoved, (parent) => {
                    const toReject = allChildrenToUnselect(parent);
                    result = _.without(result, ...toReject);
                    scope.internallyModified = true;
                });
            }
            return result;
        }

        function parentToUnSelect(childId) {
            const parent = _.filter(scope.parents, (parent) => {
                const childFound = _.find(parent.children, (child) => {
                    return child.id === childId;
                });
                return !!childFound;
            });
            return parent ? parent[0].id : null;
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
