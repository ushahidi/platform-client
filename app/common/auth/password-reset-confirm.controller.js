module.exports = [
    '$rootScope',
    '$scope',
    'PasswordReset',
    '$location',
    '$routeParams',
    '$filter',
    'Notify',
    '_',
function (
    $rootScope,
    $scope,
    PasswordReset,
    $location,
    $routeParams,
    $filter,
    Notify,
    _
) {
    $scope.processing = false;
    $scope.hasToken = false;

    var token = $routeParams.token;
    if (token) {
        $scope.token = token;
        $scope.hasToken = true;
    }

    function resetSuccess() {
        $scope.processing = false;

        Notify.showSingleAlert($filter('translate')('notify.passwordreset.success'));
        $location.url('/login');
    }

    function resetFailed(errorResponse) {
        $scope.failed = true;
        $scope.processing = false;

        Notify.showApiErrors(errorResponse);
    }

    $scope.registerSubmit = function () {
        $scope.processing = true;

        PasswordReset
            .resetConfirm($scope.token, $scope.password)
            .then(resetSuccess, resetFailed);
    };

    // user already has account
    if ($rootScope.loggedin) {
        $location.url('/');
    }
}];
