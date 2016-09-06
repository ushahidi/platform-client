module.exports = [
    '$rootScope',
    'ModalService',
function (
    $rootScope,
    ModalService
) {
    return {
        restrict: 'E',
        template: require('./attribute-editor.html'),
        link: function ($scope, $element, $attrs) {
            $scope.closeModal = function () {
                ModalService.close();
            };
        }
    };
}];
