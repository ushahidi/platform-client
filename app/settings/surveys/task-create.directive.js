module.exports = [
    '$rootScope',
    'ModalService',
function (
    $rootScope,
    ModalService
) {
    return {
        restrict: 'E',
        template: require('./task-create.html'),
        link: function ($scope, $element, $attrs) {

            // Init an empty saved search
            $scope.newTask = {
                required : false,
                attributes: [],
                type: 'task'
            };

            $scope.closeModal = function () {
                ModalService.close();
            };
        }
    };
}];
