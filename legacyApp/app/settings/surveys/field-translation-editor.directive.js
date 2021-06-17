module.exports = ['$rootScope', 'Editor', 'ModalService', 'UshahidiSdk', '$translate',
function FieldTranslationEditor($rootScope, Editor, ModalService, UshahidiSdk, $translate) {
    return {
        restrict: 'E',
        template: require('./field-translation-editor.html'),
        link: function($scope, $element, $attrs) {
            $scope.save = save;
            const initiateEditor = function () {
                const editorHeight = 180;

                $scope.translateEditor = new Editor({
                el: document.querySelector('#editFieldInstructions'),
                previewStyle: 'vertical',
                height: `${editorHeight}px`,
                initialEditType: 'wysiwyg',
                toolbarItems: [
                    'heading',
                    'bold',
                    'italic',
                    'link',
                    'ol',
                    'ul'
                ],
                usageStatistics: false
            });

            if ($scope.translateField.translations[$scope.activeLanguage].instructions) {
                $scope.translateEditor.setMarkdown($scope.translateField.translations[$scope.activeLanguage].instructions);
            }

            /** This is a hack to override the tui-editor's own inline-style
            * that makes the scroll get stuck inside the editor-area */
            let editor = document.querySelector('#editFieldInstructions');
            editor.style.height = `${editorHeight + 60}px`;
        }

        initiateEditor();

        function save() {
            $scope.translateField.translations[$scope.activeLanguage]._$ushDuplicateErrorMessage = false;
            $scope.canSave = true;

            if (
                UshahidiSdk.Surveys.fieldHasTranslations($scope.translateField, $scope.activeLanguage)
                && UshahidiSdk.Surveys.fieldCanHaveOptions($scope.translateField)
            ) {
                $scope.canSave = UshahidiSdk.Surveys.areOptionsUnique(Object.values($scope.translateField.translations[$scope.activeLanguage].options));
            }
            $scope.translateField.translations[$scope.activeLanguage].instructions = $scope.translateEditor.getMarkdown();
            if ($scope.canSave) {
                ModalService.close();
            } else {
                $scope.translateField.translations[$scope.activeLanguage]._$ushDuplicateErrorMessage = true;
                $rootScope.$broadcast('event:surveys:translationMissing');
            }
        }
    }
}
}
]
