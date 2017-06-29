module.exports = CategorySelectorDirective;

CategorySelectorDirective.$inject = [];

function CategorySelectorDirective() {
    return {
        restrict: 'E',
        scope: {
            available: '=',
            selected: '='
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

    activate();

    function activate() {

        // remove default null value when creating a new post
        if ($scope.selected[0] === null) {
            $scope.selected = [];
        }

        // filter out child categories posing as available parent
        $scope.available = _.filter($scope.available, function (category) {
            return category.parent_id === null;
        });

        flattenCategories();

    }

    function flattenCategories() {
        $scope.flattened = [];
        _.each($scope.available, function (category) {
            $scope.flattened.push(category);
            if (category.children && category.children.length) {
                _.each(category.children, function (subcategory) {
                    $scope.flattened.push(subcategory);
                });
            }
        });
    }

    function selectAll() {
        if ($scope.flattened.length === $scope.selected.length) {
            $scope.selected.length = [];
        } else {
            _.each($scope.flattened, function (category) {
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

}
