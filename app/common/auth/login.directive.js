module.exports = Login;

Login.$inject = [];
function Login() {
    return {
        restrict: 'E',
        scope: {},
        controller: LoginController,
        templateUrl: 'templates/auth/login.html'
    };
}
LoginController.$inject = [
    '$scope',
    'Authentication',
    'PasswordReset',
    '$location',
    'ConfigEndpoint'
];
function LoginController(
    $scope,
    Authentication,
    PasswordReset,
    $location,
    ConfigEndpoint
) {
    $scope.email = '';
    $scope.password = '';
    $scope.failed = false;
    $scope.processing = false;
    $scope.loginSubmit = loginSubmit;
    $scope.cancel = cancel;
    $scope.forgotPassword = forgotPassword;
    $scope.showCancel = false;

    activate();

    function activate() {
        // If we're already logged in
        if (Authentication.getLoginStatus()) {
            $scope.$parent.closeModal();
        }

        ConfigEndpoint.get({id: 'site'}, function (site) {
            $scope.showCancel = !site.private;
        });
    }

    function clearLoginForm() {
        $scope.failed = true;
        $scope.processing = false;
        $scope.email = '';
        $scope.password = '';
    }

    function cancel() {
        clearLoginForm();
        $scope.$parent.closeModal();
    }

    function finishedLogin() {
        $scope.failed = false;
        $scope.processing = false;
        $scope.$parent.closeModal();
    }

    function loginSubmit(email, password) {
        $scope.processing = true;

        Authentication
            .login(email, password)
            .then(finishedLogin, clearLoginForm);
    }

    function forgotPassword() {
        PasswordReset.openReset();
    }

}
