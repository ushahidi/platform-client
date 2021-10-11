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

SurveyTranslationEditorController.$inject = ['$rootScope', '$scope', 'ModalService','_'];
function SurveyTranslationEditorController($rootScope, $scope, ModalService, _) {
    $scope.openField = openField;
    $scope.form = {};
    $rootScope.$on('event:surveys:translationMissing', function () {
        $scope.form.translation.$setDirty();
    });

    function openField(field, task) {
        $scope.activeTask = task;
        if (!field.translations[$scope.activeLanguage]) {
            field.translations[$scope.activeLanguage] = {}
        }
        $scope.translateField = field;
        ModalService.openTemplate('<field-translation-editor></field-translation-editor>', 'translations.translate_field', '', $scope, true, true);
    }
}
