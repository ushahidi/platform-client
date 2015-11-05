module.exports = [
    '$window',
    '_',
    '$rootScope',
function ($window, _, $rootScope) {

    var showSingleAlert = function (alertMessage) {
        $rootScope.$emit('event:show:modal-alerts', [alertMessage]);
    };

    var showNotificationSlider = function (message) {
        $rootScope.$emit('event:show:notification-slider', message);
    };

    var showAlerts = function (alertMessages) {
        $rootScope.$emit('event:show:modal-alerts', alertMessages);
    };

    var showApiErrors = function (errorResponse) {
        var errors = _.pluck(errorResponse.data && errorResponse.data.errors, 'message');

        errors && showAlerts(errors);
    };

    var showConfirm = function (confirmMessage) {
        // TODO: find a better solution for that
        var confirm = $window.confirm(confirmMessage);
        return confirm;
    };

    return {
        showSingleAlert: showSingleAlert,
        showNotificationSlider: showNotificationSlider,
        showAlerts: showAlerts,
        showApiErrors: showApiErrors,
        showConfirm: showConfirm
    };

}];
