module.exports = ['$rootScope', 'Editor', 'ModalService',
function FieldTranslationEditor($rootScope, Editor, ModalService) {
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

            if (!$scope.translateField.translations[$scope.activeLanguage]) {
                $scope.translateField.translations = {};
                $scope.translateField.translations[$scope.activeLanguage] = {};
            }
            $scope.translateField.translations[$scope.activeLanguage].instructions = $scope.translateEditor.getMarkdown();
            ModalService.close();
        }
    }
}
}
]
