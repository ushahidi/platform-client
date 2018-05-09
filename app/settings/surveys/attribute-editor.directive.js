module.exports = [
    '$rootScope',
    'ModalService',
    '_',
function (
    $rootScope,
    ModalService,
    _
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
            $scope.defaultValueToggle = false;
            $scope.descriptionToggle = false;
            $scope.labelError = false;

            $scope.save = function (editAttribute, activeTask) {
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
                return $scope.editAttribute.type !== 'tags';
            };

            $scope.canDisableCaption = function () {
                return $scope.editAttribute.type === 'media' && $scope.editAttribute.input === 'upload';
            };
        }
    };
}];
