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
    $scope.changeParent = changeParent;

    function activate () {
            groupCategories();
            convertSelected();
            // selecting parent if any children are selected
            _.each($scope.parents, parent => {
                changeParent(parent);
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

    function changeParent(parent) {
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
