module.exports = [
    '$scope',
    '$rootScope',
function (
    $scope,
    $rootScope
) {
    $scope.showNotificationslider = false;
    $scope.showModalAlerts = false;
    $rootScope.$on('event:show:notification-slider', function (event, message) {
        $scope.notificationSliderMessage = message;
        $scope.showNotificationSlider = true;
    });

    $rootScope.$on('event:show:modal-alerts', function (event, messages) {
        $scope.modalAlertMessages = messages;
        $scope.showModalAlerts = true;
    });

    $rootScope.$on('event:show:modal-confirm', function (event, message) {
        $scope.modalConfirmMessage = message;
        $scope.showModalConfirm = true;
    });

    $scope.confirmResult = function (result) {
        $rootScope.$emit('event:confirm:return-confirm', result);
        $scope.showModalConfirm = false;
    };

    $scope.acknowledgeAlert = function () {
        $scope.showModalAlerts = false;
    };

}];

