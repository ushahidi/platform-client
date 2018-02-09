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
            form: '='
        },
        controller: PostCategoryEditorController,
        template: require('./post-category-editor.html')
    };
}
PostCategoryEditorController.$inject = ['$rootScope','$scope', 'TagEndpoint', 'FormAttributeEndpoint', 'Notify', '_'];

function PostCategoryEditorController($rootScope, $scope, TagEndpoint, FormAttributeEndpoint, Notify, _) {
    console.log($scope.available);

}
