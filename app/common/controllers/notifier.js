module.exports = [
    '$scope',
    '$rootScope',
function (
    $scope,
    $rootScope
) {
    $scope.showNotificationslider = false;
    $rootScope.$on('event:show:notification-slider', function (event, message) {
        $scope.notificationSliderMessage = message;
        $scope.showNotificationSlider = true;
    });

}];

