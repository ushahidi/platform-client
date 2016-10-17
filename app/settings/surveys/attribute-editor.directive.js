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
        }
    };
}];
