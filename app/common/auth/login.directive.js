module.exports = Login;

Login.$inject = [];
function Login () {
    return {
        restrict: 'E',
        scope: {
        },
        controller: LoginController,
        templateUrl: 'templates/auth/login.html',
    };
}
LoginController.$inject = [
    '$scope',
    '$rootScope',
    '$translate',
    'Authentication',
    '$location'
];
function LoginController (
    $scope,
    $rootScope,
    $translate,
    Authentication,
    $location
) {

    activate();

    $rootScope.$on('event:login:show:loginModal', function () {
        $scope.showLoginModal = true;
    });

    function activate () {
        $scope.loginSubmit = loginSubmit;
        $scope.cancel = cancel;
        $scope.email = '';
        $scope.password = '';
        $scope.showLoginModal = false;
        // If we're already logged in
        if ($rootScope.loggedin) {
            $location.url('/');
        }
        finishedLogin();
    }

    function clearLoginForm () {
        $scope.failed = true;
        $scope.processing = false;
        $scope.email = '';
        $scope.password = '';
    }

    function cancel () {
        clearLoginForm();
        $scope.showLoginModal = false;
    }

    function finishedLogin () {
        $scope.failed = false;
        $scope.processing = false;
        $scope.showLoginModal = false;
        clearLoginForm();
    }

    function loginSubmit (email, password) {
        $scope.processing = true;

        Authentication
            .login(email, password)
            .then(finishedLogin, clearLoginForm);
    }


}
