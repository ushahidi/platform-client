module.exports = AttributeTranslationEditor;

AttributeTranslationEditor.$inject = [];
function AttributeTranslationEditor() {
    return {
        restrict: 'E',
        link: AttributeTranslationEditorLink,
        template: require('./attribute-translation-editor.html')
    };
}

function AttributeTranslationEditorLink($scope) {
}
