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
    $scope.openField = openField;

    function openField(field) {
        $scope.translateField = field;
        ModalService.openTemplate('<field-translation-editor></field-translation-editor>', 'translations.translate_field', '', $scope, true, true);
    }
}
