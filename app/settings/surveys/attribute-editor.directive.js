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

            if ($scope.editAttribute.default) {
                $scope.defaultValueToggle = true;
            } else {
                $scope.defaultValueToggle = false;
            }

            $scope.descriptionToggle = false;

            $scope.editName = function () {
                if (!$scope.editAttribute.id) {
                    $scope.editAttribute.label = '';
                }
            };

            $scope.toggleDefaultValue = function () {
                $scope.defaultValueToggle = !$scope.defaultValueToggle;
            };

            $scope.closeModal = function () {
                ModalService.close();
                // Remove default value when toggled off
                if ($scope.defaultValueToggle === false) {
                    $scope.editAttribute.default = null;
                }
            };

            $scope.onlyOptional = function () {
                return $scope.editAttribute.type !== 'title' && $scope.editAttribute.type !== 'description';
            };

            $scope.canDisplay = function () {
                return $scope.editAttribute.input !== 'upload' && $scope.editAttribute.type !== 'title' && $scope.editAttribute.type !== 'description' && $scope.editAttribute.input !== 'tags';
            };

            $scope.selectChild = function (child) {
                if (!_.contains($scope.editAttribute.options, child.parent.id) && _.contains($scope.editAttribute.options, child.id)) {
                    $scope.editAttribute.options.push(child.parent.id);
                }
            };

            $scope.canMakePrivate = function () {
                return $scope.editAttribute.type !== 'tags';
            };
        }
    };
}];
