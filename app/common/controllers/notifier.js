module.exports = [
    '$scope',
    '$rootScope',
function (
    $scope,
    $rootScope
) {
    $scope.showNotificationSlider = false;
    $scope.showLimitSlider = false;
    $scope.showModalAlerts = false;
    $rootScope.$on('event:show:notification-slider', function (event, message) {
        $scope.notificationSliderMessage = message;
        $scope.sliderIsVisible = true;
    });

    var showNotificationSlider = function (message, callbackEvent, buttonText, action) {
        $scope.sliderIsVisible = true;
        $scope.notificationSliderMessage = message;
        $scope.callbackEvent = callbackEvent;
        $scope.buttonText = buttonText;
        $scope.action = action;
    };

    $rootScope.$on('event:show:limit-slider', function (event, message) {
        $scope.limitSliderMessage = message;
        $scope.showLimitSlider = true;
    });

    $rootScope.$on('event:show:modal-alerts', function (event, messages) {
        $scope.modalAlertMessages = messages;
        $scope.showModalAlerts = true;
    });

    $rootScope.$on('event:show:modal-confirm', function (event, message) {
        $scope.modalConfirmMessage = message;
        $scope.showModalConfirm = true;
    });

    $rootScope.$on('event:show:message-confirm', function (event, message, callbackEvent, buttonText, action) {
        showNotificationSlider(message, callbackEvent, buttonText, action);
        $scope.isConfirmation = true;
    });

    $rootScope.$on('event:show:message-error', function (event, message, callbackEvent, buttonText, action) {
        showNotificationSlider(message, callbackEvent, buttonText, action);
        $scope.isError = true;
    });

    $scope.confirmResult = function (result) {
        $rootScope.$emit('event:confirm:return-confirm', result);
        $scope.showModalConfirm = false;
    };

    $scope.acknowledgeAlert = function () {
        $scope.showModalAlerts = false;
    };

    $scope.emitCallbackEvent = function (callbackEvent) {
        if (callbackEvent) {
            $rootScope.$emit(callbackEvent);
        }

        $scope.sliderIsVisible = false;
    };

}];

