module.exports = [
    '$scope',
    '$rootScope',
    '$translate',
    'Authentication',
    '$location',
    '_',
function (
    $scope,
    $rootScope,
    $translate,
    Authentication,
    $location,
    _
) {
    $translate('nav.login').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

    $scope.clearLoginForm = function (response) {
        if (response.data.error === 'google2fa_secret_required') {
            $scope.otpRequired = true;
        } else if (response.data.error === 'google2fa_secret_invalid') {
            $scope.otpRequired = true;
            $scope.otpInvalid = true;
            $scope.google2fa_otp = '';
        } else {
            $scope.failed = true;
            $scope.email = '';
            $scope.password = '';
        }
        $scope.processing = false;
    };

    $scope.finishedLogin = function () {
        $scope.failed = false;
        $scope.processing = false;
    };

    $scope.loginSubmit = function () {
        $scope.processing = true;

        Authentication
            .login($scope.email, $scope.password, $scope.google2fa_otp)
            .then($scope.finishedLogin, $scope.clearLoginForm);
    };


    // If we're already logged in
    if ($rootScope.loggedin) {
        $location.url('/');
    }

    $scope.finishedLogin();
}];
