module.exports = CategorySelectorDirective;

CategorySelectorDirective.$inject = [];

function CategorySelectorDirective() {
    return {
        restrict: 'E',
        scope: {
            selected: '=',
            enableParents: '=',
            form: '=',
            available: '=',
            activeLanguage:'=',
            displayWarning:'='
        },
        controller: CategorySelectorController,
        template: require('./category-selector.html')
    };
}
CategorySelectorController.$inject = ['$scope', '_'];

function CategorySelectorController($scope, _) {
    $scope.selectAll = selectAll;
    $scope.selectChild = selectChild;
    $scope.selectParent = selectParent;
    $scope.selectedParents = [];
    $scope.disabledCategories = [];
    $scope.changeCategories = changeCategories;

    activate();
    $scope.selectAllEnabled = function () {
        if ($scope.enableParents) {
            return $scope.selected.length === $scope.available.length;
        } else {
            return ($scope.selected.length + $scope.selectedParents.length) === $scope.available.length;
        }
    };

    function activate() {
        $scope.categories = $scope.available;
        if ($scope.displayWarning) {
            $scope.categoryTranslationUnavailable = _.filter($scope.categories, (category) => {
            let available = [category.enabled_languages.default, ...category.enabled_languages.available];
            if (available.indexOf($scope.activeLanguage.language) === -1) {
                return category;
            }
        });

    }
    // with v4, the selected categories are delivered as objects
    $scope.selected = _.map($scope.selected, category => {
        if (typeof category === 'object') {
            return category.id
        } else {
            return category
        }
    });
    // making sure no children are selected without their parents
        $scope.changeCategories();
    }

    function selectAll() {
        if ($scope.form) {
            // if used in a form, add the ng-dirty-class to categories.
            $scope.form.$setDirty();
        }

        if ($scope.selectAllEnabled()) {
            $scope.selected.splice(0, $scope.selected.length);
            $scope.selectedParents.splice(0, $scope.selectedParents.length);
        } else {
            _.each($scope.available, function (category) {
                var isParentWithChildren = !category.parent_id && category.children && category.children.length > 0;
                if (!_.contains($scope.selected, category.id) && !isParentWithChildren) {
                    $scope.selected.push.apply($scope.selected, [category.id]);
                } else if (isParentWithChildren && !_.contains($scope.selectedParents, category.id)) {
                    $scope.selectedParents.push.apply($scope.selectedParents, [category.id]);
                }
            });
        }
    }

    function selectChild(child) {
        if ($scope.selected.includes(child.id)) {
            $scope.selected = _.filter($scope.selected, function (id) {
                return id !== child.id;
            });
        } else {
            $scope.selected.push(child.id);
            if (!$scope.selected.includes(child.parent.id)) {
                $scope.selected.push(child.parent.id);
            }
        }
    }

    function selectParent(parent) {
        if ($scope.selected.includes(parent.id)) {
            $scope.selected = _.filter($scope.selected, function (id) {
                return id !== parent.id;
            });
            if (parent.children && parent.children.length) {
                _.each(parent.children, function (child) {
                    $scope.selected = _.filter($scope.selected, function (id) {
                        return id !== child.id;
                    });
                });
            }
        } else {
            $scope.selected.push(parent.id);
        }
    }

    function changeCategories() {
        _.each($scope.categories, function (category) {
            var selectedChildren = _.chain(category.children)
                .pluck('id')
                .intersection($scope.selected)
                .value();
            var parentIndexSelected = -1;
            var isParentWithChildren = !category.parent_id && category.children && category.children.length > 0;
            // If children are selected, add to disabled categories
            if (selectedChildren.length > 0) {
                $scope.disabledCategories[category.id] = true;
                // ... and ensure this category is selected
                if (!_.contains($scope.selectedParents, category.id)) {
                    $scope.selectedParents.push.apply($scope.selectedParents, [category.id]);
                }
                if (!_.contains($scope.selected, category.id) && $scope.enableParents === true) {
                    $scope.selected.push.apply($scope.selected, [category.id]);
                }
            } else {
                var parentIndex = _.findIndex($scope.selectedParents, function (parentId) {
                    return parentId === category.id;
                });
                parentIndexSelected = _.findIndex($scope.selected, function (parentId) {
                    return parentId === category.id;
                });
                if (parentIndex >= 0) {
                    $scope.selectedParents.splice(parentIndex, 1);
                    if ($scope.enableParents === true) {
                        $scope.selected.splice(parentIndexSelected, 1);
                    }
                }
                if (isParentWithChildren) {
                    $scope.disabledCategories[category.id] = true;
                } else {
                    $scope.disabledCategories[category.id] = false;
                }
            }

            if ($scope.enableParents === false && isParentWithChildren) {
                parentIndexSelected = _.findIndex($scope.selected, function (parentId) {
                    return parentId === category.id;
                });
                if (parentIndexSelected >= 0) {
                    $scope.selected.splice(parentIndexSelected, 1);
                }
            }
        });

    }
}
