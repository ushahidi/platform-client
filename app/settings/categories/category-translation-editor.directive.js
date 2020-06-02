module.exports = CategoryTranslationEditor;

CategoryTranslationEditor.$inject = [];
function CategoryTranslationEditor() {
    return {
        restrict: 'E',
        scope: {
            activeLanguage: '=',
            category:'=',
            defaultLanguage:'='
        },
        controller: CategoryTranslationEditorController,
        template: require('./category-translation-editor.html')
    };
}

CategoryTranslationEditorController.$inject = [];
function CategoryTranslationEditorController() {
}
