module.exports = PostTranslationEditor;

PostTranslationEditor.$inject = [];

function PostTranslationEditor() {
    return {
        restrict: 'E',
        controller: PostTranslationEditorController,
        scope: {
            post: '=',
            activeLanguage:'=',
            defaultLanguage:'=',
            form: '='
        },
        template: require('./post-translation-editor.html')
    };
}
PostTranslationEditorController.$inject = ['$scope', '_'];

function PostTranslationEditorController($scope, _) {

    $scope.canTranslate = canTranslate;

    function activate() {}
    activate();

    function canTranslate(field) {
        return field.type === 'text' ||
            (field.input === 'text' && field.type !== 'title' && field.type !== 'description');
    }

}
