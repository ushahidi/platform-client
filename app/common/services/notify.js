module.exports = [
    '$window',
    '_',
    '$q',
    '$rootScope',
function ($window, _, $q, $rootScope) {

    var deffered;

    var showSingleAlert = function (alertMessage) {
        showAlerts([alertMessage]);
    };

    var showNotificationSlider = function (message) {
        $rootScope.$emit('event:show:notification-slider', message);
    };

    var showLimitSlider = function (message) {
        $rootScope.$emit('event:show:limit-slider', message);
    };

    var showAlerts = function (alertMessages, callbackEvent, buttonText, action) {
        $rootScope.$emit('event:show:alerts', alertMessages, callbackEvent, buttonText, action);
    };

    var showConfirm = function (message, callbackEvent, buttonText, action) {
        $rootScope.$emit('event:show:message-confirm', message, callbackEvent, buttonText, action);
        deffered = $q.defer();
        return deffered.promise;
    };

    var showConfirmModal = function (message, callbackEvent, buttonText, action) {
        $rootScope.$emit('event:show:message-confirm-modal', message, callbackEvent, buttonText, action);
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
        showConfirm: showConfirm,
        showConfirmModal: showConfirmModal,
        showConfirmSuccess: showConfirmSuccess,
        showConfirmAlert: showConfirmAlert,
        showLimitSlider: showLimitSlider
    };
}];
