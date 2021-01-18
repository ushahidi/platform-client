module.exports = CategorySelectDirective;

CategorySelectDirective.$inject = ['CategoriesSdk', '_', 'PostFilters'];
function CategorySelectDirective(CategoriesSdk, _, PostFilters) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            userLanguage:'='
        },
        require: 'ngModel',
        link: CategorySelectLink,
        template: require('./filter-category.html')
    };

    function CategorySelectLink(scope, element, attrs, ngModel) {
        if (!ngModel) {
            return;
        }

        scope.handleParents = handleParents;
        scope.categories = [];
        scope.parents = [];
        scope.selectedCategories = [];

        activate();

        function activate() {
            // Load categories from server
            CategoriesSdk.getCategories().then(function (result) {
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
            if (ngModel.$viewValue) {
                Array.prototype.splice.apply(scope.selectedCategories, [0, scope.selectedCategories.length].concat(ngModel.$viewValue));
            }
        }

        /**
         * Compares the current selected items with the previous ones and uses the parents scope var to
         * know if we need to unselect/select items based on the state and how our categories should work
         * "Filters dropdown: Top Level categories with children should behave as Select all"
         * https://github.com/ushahidi/platform/issues/2436
         * @param newSelection
         * @param oldSelection
         * @returns {*}
         */
        function handleParents(newSelection, oldSelection) {
            /**
             * If nothing changed, don't manipulate the arrays at all
             * @type {boolean}
             */
            const noChanges = newSelection === oldSelection;
            const internal = PostFilters.filtersInternalChange === true;
            /**
             *reset the internal var to false if it's true, since that means we just passed through
             * an internal change of the selectedCategories array by this function
            */
            if (internal) {
                PostFilters.filtersInternalChange = false;
            }
            if (noChanges || internal === true) {
                return newSelection;
            }
            let result = newSelection;
            const itemsAdded = _.difference(newSelection, oldSelection);
            const itemsRemoved = _.difference(oldSelection, newSelection);
            const added = itemsAdded.length > 0;
            const item = added ? itemsAdded[0] : itemsRemoved[0];
            /**
             * go through each parent category to decide if the selectedCategories need
             * to change according to the categories selection rules
             */
            _.each(scope.parents, (parent) => {
                /**
                 * parents with no children don't need any changes since they are simply enabled/disabled by the user
                 * in the checkboxes/bug icons
                */
                if (parent.children.length > 0) {
                    /**
                     * separate the children and pick only their ids
                     * @type {Array}
                     */
                    const children = _.map(parent.children, (child) => {
                        return child.id;
                    });
                    /**
                     * if the item that changed (was selected/unselected) is NOT related
                     * to the current parent (or equal) we don't need to change it
                     */
                    let itemIsRelated = item === parent.id;
                    if (!itemIsRelated) {
                        itemIsRelated = !!_.find(children, (itm) => itm === item);
                    }
                    if (!itemIsRelated) {
                        return;
                    }
                    /**
                     * Find out if the selected item is a parent;
                     */
                    const parentSelected = _.find(newSelection, (itm) => itm === parent.id);
                    /**
                     * Check if ALL the children are selected
                     */
                    const childrenAllSelected = _.every(children, (childId) => {
                        return _.find(newSelection, (itm) => itm === childId);
                    });
                    /**
                     * Check if ALL the children are unselected
                     */
                    const childrenAllUnselected = _.every(children, (childId) => {
                        return !_.find(newSelection, (itm) => itm === childId);
                    });
                    if (!parentSelected && childrenAllSelected) {
                        /**
                         * If all the children of a parent are selected but the parent isn't
                         * we need to know if the parent was just unselected or if the last child
                         * was just selected.
                         * If the last child was just selected, add the parent
                         * If the parent was just unselected, remove the children
                         */
                        if (added) {
                            result = _.uniq(newSelection.concat(parent.id));
                        } else {
                            // REMOVE children
                            result = _.without(newSelection, ...children);
                        }
                        PostFilters.filtersInternalChange = true;
                    } else if (parentSelected && childrenAllUnselected) {
                        /**
                         * If all the children of a parent are unselected but the parent is selected,
                         * we need to know if the parent was just selected or if the last child
                         * was just unselected.
                         * If the last child was just unselected, remove the parent
                         * If the parent was just selected, add the children
                         */
                        if (added) {
                            result = _.uniq(newSelection.concat(children));
                        } else {
                            // REMOVE parent
                            result = _.without(newSelection, parent.id);
                        }
                        PostFilters.filtersInternalChange = true;
                    } else if (parentSelected) {
                        /**
                         * If the parent is selected
                         * we need to know if the parent was just selected  or just unselected
                         * If the parent was just unselected, remove the parent
                         * If the parent was just selected, add the children
                         */
                        if (added) {
                            // ADD all the children
                            result = _.uniq(newSelection.concat(children));
                        } else {
                            // REMOVE parent
                            result = _.without(newSelection, parent.id);
                        }
                        PostFilters.filtersInternalChange = true;
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
