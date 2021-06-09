module.exports = [
    '$rootScope',
    'ModalService',
    '_',
    'Editor',
    'Notify',
    'UshahidiSdk',
function (
    $rootScope,
    ModalService,
    _,
    Editor,
    Notify,
    UshahidiSdk
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
                }
                editField.instructions = $scope.editor.getMarkdown();
                if (!$scope.fieldLabel.$invalid && $scope.valuesPermissible()) {
                    editField.label = $scope.label;
                    $scope.addNewField(editField, activeTask);
                } else {
                    Notify.error('survey.fields.validation.required');
                }
            };

            $scope.closeModal = function () {
                ModalService.close();
            };

            $scope.onlyOptional = function (editField) {
                return editField.type !== 'title' && editField.type !== 'description';
            };

            $scope.canDisplay = function () {
                return $scope.editField.input !== 'upload' && $scope.editField.input !== 'tags';
            };

            $scope.canDisplayDefaultValue = function () {
                return $scope.canDisplay() && $scope.editField.input !== 'location' && $scope.editField.input !== 'relation';
            }

            $scope.canMakePrivate = function () {
                return $scope.editField.type !== 'tags' && $scope.editField.type !== 'title' && $scope.editField.type !== 'description';
            };

            $scope.canDisableCaption = function () {
                return $scope.editField.type === 'media' && $scope.editField.input === 'upload';
            };
            $scope.validateDuplicate = function () {
                if (UshahidiSdk.Surveys.fieldCanHaveOptions($scope.editField)) {
                    return UshahidiSdk.Surveys.areOptionsUnique($scope.editField.options);
                }
                return true;
            }
            $scope.valuesPermissible = function () {
                if (UshahidiSdk.Surveys.fieldCanHaveOptions($scope.editField)) {
                    return UshahidiSdk.Surveys.areOptionsUnique($scope.editField.options)
                        || !UshahidiSdk.Surveys.hasEmptyOptions($scope.editField.options);
                }
                return true;
            };
        }
    };
}];
