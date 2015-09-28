module.exports = ['$window', '_', function ($window, _) {

    var showSingleAlert = function (alertMessage) {
        // TODO: find a better solution for that
        // e.g. use some notification plugins
        // like https://github.com/cgross/angular-notify
        // or https://github.com/jirikavi/AngularJS-Toaster
        $window.alert(alertMessage);
    };

    var showAlerts = function (alertMessages) {
        showSingleAlert(alertMessages.join('\n'));
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
        showAlerts: showAlerts,
        showApiErrors: showApiErrors,
        showConfirm: showConfirm
    };

}];
