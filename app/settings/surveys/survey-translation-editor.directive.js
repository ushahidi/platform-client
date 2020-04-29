module.exports = SurveyTranslationEditor;

SurveyTranslationEditor.$inject = [];
function SurveyTranslationEditor() {
    return {
        restrict: 'E',
        scope: {
            activeLanguage: '=',
            survey:'=',
            defaultLanguage:'='
        },
        controller: SurveyTranslationEditorController,
        template: require('./survey-translation-editor.html')
    };
}

SurveyTranslationEditorController.$inject = ['$scope', 'ModalService'];
function SurveyTranslationEditorController($scope, ModalService) {
    $scope.openAttribute = openAttribute;

    function openAttribute(attribute) {
        ModalService.openTemplate('<attribute-translation-editor></attribute-translation-editor>', 'translations.translate_field', false, true, true, true);
    }
}
