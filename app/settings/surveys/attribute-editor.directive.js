module.exports = [
    '$rootScope',
    'ModalService',
function (
    $rootScope,
    ModalService
) {
    return {
        restrict: 'E',
        templateUrl: 'templates/settings/surveys/attribute-editor.html',
        link: function ($scope, $element, $attrs) {
            $scope.closeModal = function () {
                ModalService.close();
            };

            $scope.canDelete = function () {
                return $scope.editAttribute.type !== 'title' && $scope.editAttribute.type !== 'description';
            };

            $scope.canDisplay = function () {
                return $scope.editAttribute.input !== 'upload' && $scope.editAttribute.type !== 'title' && $scope.editAttribute.type !== 'description';
            };
        }
    };
}];
