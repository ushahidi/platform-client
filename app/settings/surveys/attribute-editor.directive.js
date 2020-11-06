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
                if ($scope.valuesPermissible() && !$scope.attributeLabel.$invalid) {
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

            $scope.displayVideoLabel = function () {
                return $scope.editAttribute.input === 'video';
            };

            $scope.displayDateLabel = function () {
                return $scope.editAttribute.input === 'date';
            };

            $scope.displayDateTimeLabel = function () {
                return $scope.editAttribute.input === 'datetime';
            };

            $scope.displayIntLabel = function () {
                return $scope.editAttribute.type === 'int';
            };

            $scope.displayDecimalLabel = function () {
                return $scope.editAttribute.type === 'decimal';
            };

            $scope.displayDefaultLabel = function () {
                return $scope.editAttribute.input !== 'video' && $scope.editAttribute.type !== 'int' && $scope.editAttribute.type !== 'decimal' && $scope.editAttribute.input !== 'date' && $scope.editAttribute.input !== 'datetime' && $scope.editAttribute.input !== 'location' && $scope.editAttribute.input !== 'relation';
            };

            $scope.errorMsgs = {
                'num': 'Number(s) only',
                'video': 'Enter valid video link',
                'date': 'Enter valid date format',
                'dateTime': 'Enter valid date & time format',
                'others': 'hidden'
            };

            $scope.inputType = [
                $scope.editAttribute.input === 'number',
                $scope.editAttribute.input === 'video',
                $scope.editAttribute.input === 'date',
                $scope.editAttribute.input === 'datetime'
            ]

            $scope.errorMessage = function () {

                if ($scope.inputType[0]) {
                    $scope.errorMsg = $scope.errorMsgs.num;
                }

                if ($scope.inputType[1]) {
                    $scope.errorMsg = $scope.errorMsgs.video;
                }

                if ($scope.inputType[2]) {
                    $scope.errorMsg = $scope.errorMsgs.date;
                }

                if ($scope.inputType[3]) {
                    $scope.errorMsg = $scope.errorMsgs.dateTime;
                }

                if (!$scope.errorMsg) {
                    $scope.errorMsg = $scope.errorMsgs.others;
                }

                return $scope.errorMsg;
            };

            $scope.canDisplayError = function () {

                let length = $scope.editAttribute.default.length;

                if ($scope.inputType[0] && isNaN($scope.editAttribute.default) && length >= 1) {
                    return angular.element(document.querySelector('#displayError')).removeClass('hidden') && angular.element(document.querySelector('#form-field')).addClass('error');
                }

                if ($scope.inputType[1] && length >= 1) {

                   let urlSupported = [
                    'https://www.youtube.com/watch',
                    'https://youtube.googleapis.com/v/',
                    'https://youtu.be/',
                    'https://vimeo.com/',
                    'https://player.vimeo.com/video/',

                    'http://www.youtube.com/watch',
                    'http://youtube.googleapis.com/v/',
                    'http://youtu.be/',
                    'http://vimeo.com/',
                    'http://player.vimeo.com/video/',

                    '//player.vimeo.com/video/'
                   ]

                   let userUrl = $scope.editAttribute.default.substr(0, length);

                   if (
                    userUrl.match(urlSupported[0].substr(0, length)) ||
                    userUrl.match(urlSupported[1].substr(0, length)) ||
                    userUrl.match(urlSupported[2].substr(0, length)) ||
                    userUrl.match(urlSupported[3].substr(0, length)) ||
                    userUrl.match(urlSupported[4].substr(0, length)) ||
                    userUrl.match(urlSupported[5].substr(0, length)) ||
                    userUrl.match(urlSupported[6].substr(0, length)) ||
                    userUrl.match(urlSupported[7].substr(0, length)) ||
                    userUrl.match(urlSupported[8].substr(0, length)) ||
                    userUrl.match(urlSupported[9].substr(0, length)) ||
                    userUrl.match(urlSupported[10].substr(0, length))
                   ) {
                        return angular.element(document.querySelector('#displayError')).addClass('hidden') && angular.element(document.querySelector('#form-field')).removeClass('error');
                   } else {
                        return angular.element(document.querySelector('#displayError')).removeClass('hidden') && angular.element(document.querySelector('#form-field')).addClass('error');
                   }
                }

                if ($scope.inputType[2]) {

                    for (let i = 0; i <= length - 1; i += 1) {

                        if ((i >= 0 && i <= 3 || i >= 5 && i <= 6 || i >= 8 && i <= 9) && isNaN($scope.editAttribute.default.charAt(i))) {
                            return angular.element(document.querySelector('#displayError')).removeClass('hidden') && angular.element(document.querySelector('#form-field')).addClass('error');
                        }

                        if ((i === 4 || i === 7) && $scope.editAttribute.default.charAt(i) !== '-') {
                            return angular.element(document.querySelector('#displayError')).removeClass('hidden') && angular.element(document.querySelector('#form-field')).addClass('error');
                        }

                    }
                }

                if ($scope.inputType[3]) {

                    for (let i = 0; i <= length - 1; i += 1) {

                        if ((i >= 0 && i <= 3 || i >= 5 && i <= 6 || i >= 8 && i <= 9 || i >= 11 && i <= 12 || i >= 14 && i <= 15) && isNaN($scope.editAttribute.default.charAt(i))) {
                            return angular.element(document.querySelector('#displayError')).removeClass('hidden') && angular.element(document.querySelector('#form-field')).addClass('error');
                        }

                        if ((i === 4 || i === 7) && $scope.editAttribute.default.charAt(i) !== '-') {
                            return angular.element(document.querySelector('#displayError')).removeClass('hidden') && angular.element(document.querySelector('#form-field')).addClass('error');
                        }

                        if ((i === 10 || i === 16) && $scope.editAttribute.default.charAt(i) !== ' ') {
                            return angular.element(document.querySelector('#displayError')).removeClass('hidden') && angular.element(document.querySelector('#form-field')).addClass('error');
                        }

                        if (i === 13 && $scope.editAttribute.default.charAt(i) !== ':') {
                            return angular.element(document.querySelector('#displayError')).removeClass('hidden') && angular.element(document.querySelector('#form-field')).addClass('error');
                        }

                        if (i === 17 && !$scope.editAttribute.default.charAt(i).match(/a|p/)) {
                            return angular.element(document.querySelector('#displayError')).removeClass('hidden') && angular.element(document.querySelector('#form-field')).addClass('error');
                        }

                        if (i === 18 && $scope.editAttribute.default.charAt(i) !== 'm') {
                            return angular.element(document.querySelector('#displayError')).removeClass('hidden') && angular.element(document.querySelector('#form-field')).addClass('error');
                        }
                    }
                }

                return angular.element(document.querySelector('#displayError')).addClass('hidden') && angular.element(document.querySelector('#form-field')).removeClass('error');
            };

            $scope.valuesPermissible = function () {
                if ($scope.editAttribute.options.length < 1) {
                    return true;
                }
                let tmp = [];
                for (let x of $scope.editAttribute.options) {
                    if (tmp.indexOf(x) !== -1) {
                        return false;
                    }
                    tmp.push(x);
                }
                return true;
            };
        }
    };
}];
