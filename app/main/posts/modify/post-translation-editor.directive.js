module.exports = PostTranslationEditor;

PostTranslationEditor.$inject = [];

function PostTranslationEditor() {
    return {
        restrict: 'E',
        controller: PostTranslationEditorController,
        scope: {
            post: '=',
            activeLanguage:'=',
            defaultLanguage:'='
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
        return field.input === 'text' ||
            field.input === 'textarea' &&
            field.type !== 'title' &&
            field.type !== 'description'

    }

}
