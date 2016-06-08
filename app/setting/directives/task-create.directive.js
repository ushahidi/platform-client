module.exports = [
    '$rootScope',
    'ModalService',
function (
    $rootScope,
    ModalService
) {
    return {
        restrict: 'E',
        templateUrl: 'templates/settings/surveys/modify/survey-task-create.html',
        link: function ($scope, $element, $attrs) {

            // Init an empty saved search
            $scope.newTask = {
                required : false,
                attributes: []
            };

            $scope.closeModal = function () {
                ModalService.close();
            };
        }
    };
}];
