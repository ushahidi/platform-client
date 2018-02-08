module.exports = CategorySelectDirective;

CategorySelectDirective.$inject = ['TagEndpoint', '_', 'PostFilters'];
function CategorySelectDirective(TagEndpoint, _, PostFilters) {
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
        scope.internal = function () {
            PostFilters.filtersInternalChange = false;
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
        function handleParents(newSelection, oldSelection) {
            const noChanges = newSelection === oldSelection;
            const internal = PostFilters.filtersInternalChange === true;
            if (internal) {
                PostFilters.filtersInternalChange = false;
            }
            if (noChanges || internal === true) {
                return newSelection;
            }
            // if we find a selected parent and SOME of its children are missing, but not all:
            // unselect the parent

            // if we find an unselected parent with ALL children selected
            // select the parent

            // if we find a parent selected with NO children selected
            // select all children
            let result = newSelection;
            const itemsAdded = _.difference(newSelection, oldSelection);
            const itemsRemoved = _.difference(oldSelection, newSelection);
            const added = itemsAdded.length > 0;
            const item = added ? itemsAdded[0] : itemsRemoved[0];
            _.each(scope.parents, (parent) => {
                if (parent.children.length > 0) {
                    const children = _.map(parent.children, (child) => {
                        return child.id;
                    });
                    let itemIsRelated = item === parent.id;
                    if (!itemIsRelated) {
                        itemIsRelated = !!_.find(children, (itm) => itm === item);
                    }
                    if (!itemIsRelated) {
                        return;
                    }

                    const parentSelected = _.find(newSelection, (itm) => itm === parent.id);
                    const childrenAllSelected = _.every(children, (childId) => {
                        return _.find(newSelection, (itm) => itm === childId);
                    });
                    const childrenAllUnselected = _.every(children, (childId) => {
                        return !_.find(newSelection, (itm) => itm === childId);
                    });
                    const someChildrenSelected = _.some(children, (childId) => {
                        return _.find(newSelection, (itm) => itm === childId);
                    });
                    if (!parentSelected && childrenAllSelected) {
                        if (added) {
                            // ADD parent
                            result = _.uniq(newSelection.concat(parent.id));
                            PostFilters.filtersInternalChange = true;
                        } else {
                            // REMOVE children
                            result = _.without(newSelection, ...children);
                            PostFilters.filtersInternalChange = true;
                        }
                    } else if (parentSelected && childrenAllUnselected) {
                        // ADD the children
                        if (added) {
                            result = _.uniq(newSelection.concat(children));
                            PostFilters.filtersInternalChange = true;
                        } else {
                            // REMOVE parent
                            result = _.without(newSelection, parent.id);
                            PostFilters.filtersInternalChange = true;
                        }

                    } else if (parentSelected && someChildrenSelected) {
                        if (added) {
                            // ADD all the children
                            result = _.uniq(newSelection.concat(children));
                            PostFilters.filtersInternalChange = true;
                        } else {
                            // REMOVE parent
                            result = _.without(newSelection, parent.id);
                            PostFilters.filtersInternalChange = true;
                        }
                    }

                }
            });
            return result;
        }

        function saveValueToView(selectedCategories, oldSelection) {
            const result = handleParents(selectedCategories, oldSelection);
            selectedCategories = result;
            ngModel.$setViewValue(angular.copy(selectedCategories), ngModel.$viewValue);
        }
    }
}
