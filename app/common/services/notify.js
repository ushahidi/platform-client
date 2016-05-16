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

    var showAlerts = function (error, callbackEvent, buttonText, action) {
        $rootScope.$emit('event:show:alerts', error, callbackEvent, buttonText, action);
    };

    var showConfirmMessage = function (message, callbackEvent, buttonText, action) {
        $rootScope.$emit('event:show:message-confirm', message, callbackEvent, buttonText, action);
        deffered = $q.defer();
        return deffered.promise;
    };

    var showConfirmSuccess = function (message, callbackEvent, buttonText, action) {
        $rootScope.$emit('event:show:success-confirm', message, callbackEvent, buttonText, action);
        deffered = $q.defer();
        return deffered.promise;
    };

    var showConfirmAlert = function (message, callbackEvent, buttonText, action) {
        $rootScope.$emit('event:show:alert-confirm', message, callbackEvent, buttonText, action);
        deffered = $q.defer();
        return deffered.promise;
    };

    var showApiErrors = function (errorResponse) {
        var errors = _.pluck(errorResponse.data && errorResponse.data.errors, 'message');

        errors && showAlerts(errors);
    };

    $rootScope.$on('event:confirm:return-confirm', function (event, result) {
        result ? deffered.resolve(result) : deffered.reject(result);
    });

    return {
        showSingleAlert: showSingleAlert,
        showNotificationSlider: showNotificationSlider,
        showAlerts: showAlerts,
        showApiErrors: showApiErrors,
        // TODO: Update showConfirm with either showConfirmMessage or showConfirmAlert
        //showConfirm: showConfirm,
        showConfirmMessage: showConfirmMessage,
        showConfirmSuccess: showConfirmSuccess,
        showConfirmAlert: showConfirmAlert,
        showLimitSlider: showLimitSlider
    };

}];
