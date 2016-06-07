module.exports = [
    '$rootScope',
    '$scope',
    'PasswordReset',
    '$location',
    '$filter',
    'Notify',
    '_',
function (
    $rootScope,
    $scope,
    PasswordReset,
    $location,
    $filter,
    Notify,
    _
) {
    $scope.processing = false;

    function resetDone() {
        $scope.processing = false;

        //Notify.showSingleAlert($filter('translate')('notify.register.success'));
        $location.url('/forgotpassword/confirm');
    }

    $scope.registerSubmit = function () {
        $scope.processing = true;

        PasswordReset
            .reset($scope.email)
            .finally(resetDone);
    };

    // user already has account
    if ($rootScope.loggedin) {
        $location.url('/');
    }
}];
