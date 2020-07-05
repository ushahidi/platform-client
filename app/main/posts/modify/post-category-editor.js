module.exports = PostCategoryEditorDirective;

PostCategoryEditorDirective.$inject = [];

function PostCategoryEditorDirective() {
    return {
        restrict: 'E',
        scope: {
            formId: '=',
            attribute: '=',
            postValue: '=',
            available: '=',
            selected: '=',
            form: '=',
            activeSurveyLanguage:'='
        },
        controller: PostCategoryEditorController,
        template: require('./post-category-editor.html')
    };
}
PostCategoryEditorController.$inject = ['$rootScope','$scope', 'TagEndpoint', 'FormAttributeEndpoint', 'Notify', '_'];

function PostCategoryEditorController($rootScope, $scope, TagEndpoint, FormAttributeEndpoint, Notify, _) {
    $scope.toggleParent = toggleParent;
    $scope.selectAll = selectAll;
    $scope.isSelectAll = false;
    $scope.toggleCategory = toggleCategory;

    function activate () {
            groupCategories();
            convertSelected();
            // selecting parent if any children are selected
            _.each($scope.parents, parent => {
                toggleParent(parent);
            })
    }
    activate();

    function groupCategories () {
        $scope.parents = _.filter($scope.available, category => {
            if (!category.parent_id) {
                return category;
            }
        });
    }
    function convertSelected() {
        $scope.selected = _.pluck($scope.selected, 'id');
    }

    function toggleParent(parent, childId) {
        if (childId) {
            if ($scope.selected.indexOf(childId) === -1) {
                $scope.selected.push(childId);
            } else {
                $scope.selected.splice($scope.selected.indexOf(childId),1);
            }
        }

        if (parent.children && parent.children.length > 0) {
            let selectedChildren = _.chain(parent.children)
                .pluck('id')
                .intersection($scope.selected)
                .value();
            if (selectedChildren.length > 0 && $scope.selected.indexOf(parent.id) === -1) {
                $scope.selected.push(parent.id)
            }
            if (selectedChildren.length === 0 && $scope.selected.indexOf(parent.id) >= 0) {
                $scope.selected.splice($scope.selected.indexOf(parent.id),1);
            }
        }
    }

    function toggleCategory(category) {
        if (!category.children || category.children.length === 0) {
            if ($scope.selected.indexOf(category.id) === -1) {
                $scope.selected.push(category.id)
            } else {
                $scope.selected.splice($scope.selected.indexOf(category.id),1);
            }
        }
    }

    function selectAll() {
        if ($scope.selected.length === $scope.available.length) {
            $scope.selected = [];
        } else {
            $scope.selected = angular.copy($scope.available);
            convertSelected();
        }
    }
}
