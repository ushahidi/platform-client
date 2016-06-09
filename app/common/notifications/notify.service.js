module.exports = Notify;

var deferred;

Notify.$inject = ['$window', '_', '$q', '$rootScope'];
function Notify($window, _, $q, $rootScope) {
    $rootScope.$on('event:confirm:return-confirm', handleReturnConfirm);

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

    function showSingleAlert(alertMessage) {
        showAlerts([alertMessage]);
    }

    function showNotificationSlider(message) {
        $rootScope.$emit('event:show:notification-slider', message);
    }

    function showLimitSlider(message) {
        $rootScope.$emit('event:show:limit-slider', message);
    }

    function showAlerts(alertMessages, callbackEvent, buttonText, action) {
        $rootScope.$emit('event:show:alerts', alertMessages, callbackEvent, buttonText, action);
    }

    function showConfirm(message, callbackEvent, buttonText, action) {
        $rootScope.$emit('event:show:message-confirm', message, callbackEvent, buttonText, action);
        deferred = $q.defer();
        return deferred.promise;
    }

    function showConfirmModal(message, callbackEvent, buttonText, action) {
        $rootScope.$emit('event:show:message-confirm-modal', message, callbackEvent, buttonText, action);
        deferred = $q.defer();
        return deferred.promise;
    }

    function showConfirmSuccess(message, callbackEvent, buttonText, action) {
        $rootScope.$emit('event:show:success-confirm', message, callbackEvent, buttonText, action);
        deferred = $q.defer();
        return deferred.promise;
    }

    function showConfirmAlert(message, callbackEvent, buttonText, action) {
        $rootScope.$emit('event:show:alert-confirm', message, callbackEvent, buttonText, action);
        deferred = $q.defer();
        return deferred.promise;
    }

    function showApiErrors(errorResponse) {
        var errors = _.pluck(errorResponse.data && errorResponse.data.errors, 'message');

        errors && showAlerts(errors);
    }

    function handleReturnConfirm(event, result) {
        result ? deferred.resolve(result) : deferred.reject(result);
    }
}
