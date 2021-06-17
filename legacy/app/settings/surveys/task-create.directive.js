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
                fields: [],
                type: 'task',
                show_when_published: false,
                task_is_internal_only: true
            };

            $scope.closeModal = function () {
                ModalService.close();
            };
        }
    };
}];
