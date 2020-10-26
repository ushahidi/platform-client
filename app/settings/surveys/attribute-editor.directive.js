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
            $scope.label = angular.copy($scope.editAttribute.label);
            $scope.editAttribute.config = (!$scope.editAttribute.config || (_.isArray($scope.editAttribute.config) && $scope.editAttribute.config.length === 0)) ? {} : $scope.editAttribute.config;
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

                $scope.editor.setMarkdown($scope.editAttribute.instructions);
                /** This is a hack to override the tui-editor's own inline-style
                 * that makes the scroll get stuck inside the editor-area */
                let editor = document.querySelector('#editSection');
                editor.style.height = `${editorHeight + 60}px`;
            };

            initiateEditor();

            $scope.save = function (editAttribute, activeTask) {
                editAttribute.instructions = $scope.editor.getMarkdown();
                if (!$scope.attributeLabel.$invalid) {
                    $scope.editAttribute.label = $scope.label;
                    $scope.addNewAttribute(editAttribute, activeTask);
                }
            };

            $scope.closeModal = function () {
                ModalService.close();
            };

            $scope.onlyOptional = function () {
                return $scope.editAttribute.type !== 'title' && $scope.editAttribute.type !== 'description';
            };

            $scope.canDisplay = function () {
                return $scope.editAttribute.input !== 'upload' && $scope.editAttribute.type !== 'title' && $scope.editAttribute.type !== 'description' && $scope.editAttribute.input !== 'tags';
            };

            $scope.canMakePrivate = function () {
                return $scope.editAttribute.type !== 'tags' && $scope.editAttribute.type !== 'title' && $scope.editAttribute.type !== 'description';
            };

            $scope.canDisableCaption = function () {
                return $scope.editAttribute.type === 'media' && $scope.editAttribute.input === 'upload';
            };

            $scope.canDisplayDefaultValue = function () {
                return $scope.editAttribute.input !== 'upload' && $scope.editAttribute.type !== 'title' && $scope.editAttribute.type !== 'description' && $scope.editAttribute.input !== 'tags' && $scope.editAttribute.input !== 'location' && $scope.editAttribute.input !== 'relation';
            };

            $scope.errorMsgs = {
                'num': 'Number(s) only',
                'video': 'Enter valid video link',
                'others': 'hidden'
            };

            $scope.inputType = [
                $scope.editAttribute.input === 'number',
                $scope.editAttribute.input === 'video'
            ]

            $scope.errorMessage = function () {

                if ($scope.inputType[0]) {
                    $scope.errorMsg = $scope.errorMsgs.num;
                }

                if ($scope.inputType[1]) {
                    $scope.errorMsg = $scope.errorMsgs.video;
                }

                if (!$scope.errorMsg) {
                    $scope.errorMsg = $scope.errorMsgs.others;
                }

                return $scope.errorMsg;
            };

            $scope.canDisplayError = function () {

                if ($scope.inputType[0] && isNaN($scope.editAttribute.default) && $scope.editAttribute.default.length >= 1) {
                   return angular.element(document.querySelector('#displayError')).removeClass('hidden') && angular.element(document.querySelector('#form-field')).addClass('error');
                }

                if ($scope.inputType[1] && $scope.editAttribute.default.length >= 1) {
                    if (
                        ($scope.editAttribute.default.length === 1 && $scope.editAttribute.default.indexOf('h') !== 0) ||
                        ($scope.editAttribute.default.length === 2 && $scope.editAttribute.default.indexOf('ht') !== 0) ||
                        ($scope.editAttribute.default.length === 3 && $scope.editAttribute.default.indexOf('htt') !== 0) ||
                        ($scope.editAttribute.default.length === 4 && $scope.editAttribute.default.indexOf('http') !== 0) ||
                        ($scope.editAttribute.default.length === 5 && !$scope.editAttribute.default.match(/http:|https/)) ||
                        ($scope.editAttribute.default.length === 6 && !$scope.editAttribute.default.match(/http:\/|https:/)) ||
                        ($scope.editAttribute.default.length === 7 && !$scope.editAttribute.default.match(/http:\/\/|https:\//)) ||
                        ($scope.editAttribute.default.length >= 8 && !$scope.editAttribute.default.match(/http:\/\/|https:\/\//))
                    ) {
                        return angular.element(document.querySelector('#displayError')).removeClass('hidden') && angular.element(document.querySelector('#form-field')).addClass('error');
                    }
                }

                return angular.element(document.querySelector('#displayError')).addClass('hidden') && angular.element(document.querySelector('#form-field')).removeClass('error');

            };
        }
    };
}];
