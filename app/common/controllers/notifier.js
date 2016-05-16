module.exports = [
    '$scope',
    '$rootScope',
function (
    $scope,
    $rootScope
) {
    $scope.showNotificationSlider = false;
    $scope.showLimitSlider = false;
    $scope.showAlertSlider = false;
    $scope.showConfirmationSlider = false;

    $rootScope.$on('event:show:notification-slider', function (event, message) {
        $scope.notificationSliderMessage = message;
        $scope.showNotificationSlider = true;
    });

    $rootScope.$on('event:show:limit-slider', function (event, message) {
        $scope.limitSliderMessage = message;
        $scope.showLimitSlider = true;
    });

    $rootScope.$on('event:show:message-confirm', function (event, message, callbackEvent, buttonText, action) {
        $scope.showConfirmationSlider = true;
        $scope.confirmationMessage = message;
        $scope.callbackEvent = callbackEvent;
        $scope.buttonText = buttonText;
        $scope.action = action;
    });

    $rootScope.$on('event:show:success-confirm', function (event, message, callbackEvent, buttonText, action) {
        $scope.showConfirmationSlider = true;
        $scope.confirmationMessage = message;
        $scope.callbackEvent = callbackEvent;
        $scope.buttonText = buttonText;
        $scope.action = action;
        $scope.isSuccess = true;
    });

    $rootScope.$on('event:show:alert-confirm', function (event, message, callbackEvent, buttonText, action) {
        $scope.showConfirmationSlider = true;
        $scope.confirmationMessage = message;
        $scope.callbackEvent = callbackEvent;
        $scope.buttonText = buttonText;
        $scope.action = action;
        $scope.isAlert = true;
    });

    $rootScope.$on('event:show:alerts', function (event, alerts, callbackEvent, buttonText, action) {
        $scope.showAlertSlider = true;
        $scope.alerts = alerts;
        $scope.callbackEvent = callbackEvent;
        $scope.buttonText = buttonText;
        $scope.action = action;
        $scope.isAlert = true;
    });

    $scope.confirmResult = function (result) {
        $rootScope.$emit('event:confirm:return-confirm', result);
        $scope.showConfirmationSlider = false;
    };

    $scope.acknowledgeAlert = function () {
        $scope.showAlertSlider = false;
    };

    $scope.acknowledgeNotification = function () {
        $scope.showNotificationSlider = false;
    };

    $scope.emitCallbackEvent = function (callbackEvent) {
        if (callbackEvent) {
            $rootScope.$emit(callbackEvent);
        } else {
            // default to OK confirmation
            $rootScope.$emit('event:confirm:return-confirm', true);
        }

        $scope.showConfirmationSlider = false;
    };
}];

