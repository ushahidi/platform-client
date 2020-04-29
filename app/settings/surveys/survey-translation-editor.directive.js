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

SurveyTranslationEditorController.$inject = ['$scope'];
function SurveyTranslationEditorController($scope) {
}
