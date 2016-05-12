module.exports = [
    '$window',
    '_',
    '$q',
    '$rootScope',
function ($window, _, $q, $rootScope) {

    var deffered;

    var showSingleAlert = function (alertMessage) {
        $rootScope.$emit('event:show:modal-alerts', [alertMessage]);
    };

    var showNotificationSlider = function (message) {
        $rootScope.$emit('event:show:notification-slider', message);
    };

    var showLimitSlider = function (message) {
        $rootScope.$emit('event:show:limit-slider', message);
    };

    var showAlerts = function (alertMessages) {
        $rootScope.$emit('event:show:modal-alerts', alertMessages);
    };

    var showErrorMessage = function (error, callbackEvent, buttonText, action) {
        $rootScope.$emit('event:show:message-error', error, callbackEvent, buttonText, action);
    };

    var showConfirmationMessage = function (message, callbackEvent, buttonText, action) {
        $rootScope.$emit('event:show:message-confirmation', message, callbackEvent, buttonText, action);
    };

    var showApiErrors = function (errorResponse) {
        var errors = _.pluck(errorResponse.data && errorResponse.data.errors, 'message');

        errors && showAlerts(errors);
    };

    $rootScope.$on('event:confirm:return-confirm', function (event, result) {
        result ? deffered.resolve(result) : deffered.reject(result);
    });

    var showConfirm = function (confirmMessage) {
        $rootScope.$emit('event:show:modal-confirm', confirmMessage);
        deffered = $q.defer();
        return deffered.promise;
    };

    return {
        showSingleAlert: showSingleAlert,
        showNotificationSlider: showNotificationSlider,
        showAlerts: showAlerts,
        showApiErrors: showApiErrors,
        showConfirm: showConfirm,
        showLimitSlider: showLimitSlider,
        showErrorMessage: showErrorMessage,
        showConfirmationMessage: showConfirmationMessage
    };

}];
