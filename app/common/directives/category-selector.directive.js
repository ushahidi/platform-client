module.exports = CategorySelectorDirective;

CategorySelectorDirective.$inject = [];

function CategorySelectorDirective() {
    return {
        restrict: 'E',
        scope: {
            selected: '=',
            form: '='
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

    function activate() {
        // remove default null value when creating a new post
        if ($scope.selected[0] === null) {
            $scope.selected = [];
        }
        $scope.categories = [];

        $scope.categories = $scope.$parent.available;

        // making sure no children are selected without their parents
        $scope.changeCategories();
    }

    function selectAll() {
        if ($scope.form) {
            // if used in a form, add the ng-dirty-class to categories.
            $scope.form.$setDirty();
        }

        if ($scope.$parent.available.length === $scope.selected.length) {
            $scope.selected.splice(0, $scope.selected.length);
        } else {
            _.each($scope.$parent.available, function (category) {
                if (!_.contains($scope.selected, category.id)) {
                    $scope.selected.push(category.id);
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

            // If children are selected, add to disabled categories
            if (selectedChildren.length > 0) {
                $scope.disabledCategories[category.id] = true;
                // ... and ensure this category is selected
                if (!_.contains($scope.selectedParents, category.id)) {
                    $scope.selectedParents.push.apply($scope.selectedParents, [category.id]);
                }
            } else {
                var parentIndex = _.findIndex($scope.selectedParents, function (parentId) {
                    return parentId === category.id;
                });
                if (parentIndex >= 0) {
                    $scope.selectedParents.splice(parentIndex, 1);
                    // or, if no children are selected
                    // remove from disabled categories
                }

                $scope.disabledCategories[category.id] = false;
            }
        });

    }
}
