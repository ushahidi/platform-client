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

    $rootScope.$on('event:show:modal-alerts', function (event, message) {
        $scope.modalAlertsMessage = message;
        $scope.showModalAlerts = true;
    });

}];

