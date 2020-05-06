module.exports = [
    '$rootScope',
    'ModalService',
    '_',
    'Editor',
function (
    $rootScope,
    ModalService,
    _,
    Editor
    ) {
    return {
        restrict: 'E',
        template: require('./attribute-editor.html'),
        link: function ($scope, $element, $attrs) {
            /**
             * FIXME: this is a hacky solution to replace the empty config array for an object literal.
             * - What should happen is that we get an empty object literal, or NULL, directly from the backend.
             * - What really happens is that we get an array, add a key on it, and then it cannot be stringified correctly, which prevents the information from getting to the backend.
             */
            $scope.label = angular.copy($scope.editField.label);
            $scope.editField.config = (!$scope.editField.config || (_.isArray($scope.editField.config) && $scope.editField.config.length === 0)) ? {} : $scope.editField.config;
            $scope.labelError = false;

            const initiateEditor = function () {
                const editorHeight = 180;
                $scope.editor = new Editor({
                    el: document.querySelector('#editSection'),
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

                $scope.editor.setMarkdown($scope.editField.instructions);
                /** This is a hack to override the tui-editor's own inline-style
                 * that makes the scroll get stuck inside the editor-area */
                let editor = document.querySelector('#editSection');
                editor.style.height = `${editorHeight + 60}px`;
            };

            initiateEditor();

            $scope.save = function (editField, activeTask) {
                if (!editField.translations) {
                    editField.translations = {};
                    editField.translations[$scope.defaultLanguage] = {};
                }
                editField.translations[$scope.defaultLanguage].instructions = $scope.editor.getMarkdown();
                if (!$scope.fieldLabel.$invalid) {
                    editField.translations[$scope.defaultLanguage].label = $scope.label
                    $scope.addNewField(editField, activeTask);
                }
            };

            $scope.closeModal = function () {
                ModalService.close();
            };

            $scope.onlyOptional = function () {
                return $scope.editField.type !== 'title' && $scope.editField.type !== 'description';
            };

            $scope.canDisplay = function () {
                return $scope.editField.input !== 'upload' && $scope.editField.type !== 'title' && $scope.editField.type !== 'description' && $scope.editField.input !== 'tags';
            };

            $scope.canMakePrivate = function () {
                return $scope.editField.type !== 'tags' && $scope.editField.type !== 'title' && $scope.editField.type !== 'description';
            };

            $scope.canDisableCaption = function () {
                return $scope.editField.type === 'media' && $scope.editField.input === 'upload';
            };
        }
    };
}];
