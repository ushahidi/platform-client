module.exports = [
    '$rootScope',
    'ModalService',
function (
    $rootScope,
    ModalService
) {
    return {
        restrict: 'E',
        templateUrl: 'templates/settings/surveys/modify/survey-attribute-editor.html',
        link: function ($scope, $element, $attrs) {
            $scope.closeModal = function () {
                ModalService.close();
            };
        }
    };
}];
