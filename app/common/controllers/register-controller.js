module.exports = [
    '$rootScope',
    '$scope',
    'Registration',
    '$location',
    '$filter',
    'Notify',
    '_',
function (
    $rootScope,
    $scope,
    Registration,
    $location,
    $filter,
    Notify,
    _
) {
    $scope.failed = false;
    $scope.processing = false;

    function registerSuccess() {
        $scope.failed = false;
        $scope.processing = false;

        Notify.showSingleAlert($filter('translate')('notify.register.success'));
        $location.url('/');
    }

    function registerFailed(errorResponse) {
        $scope.failed = true;
        $scope.processing = false;

        var errors = _.pluck(errorResponse.data && errorResponse.data.errors, 'message');
        errors && Notify.showAlerts(errors);
    }

    $scope.registerSubmit = function () {
        $scope.processing = true;

        Registration
            .register($scope.email, $scope.password)
            .then(registerSuccess, registerFailed);
    };

    // user already has account
    if ($rootScope.loggedin) {
        $location.url('/');
    }
}];
