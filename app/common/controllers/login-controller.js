module.exports = [
    '$scope',
    '$rootScope',
    '$translate',
    'Authentication',
    '$location',
function (
    $scope,
    $rootScope,
    $translate,
    Authentication,
    $location
) {
    $translate('nav.login').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

    function clearLoginForm() {
        $scope.failed = true;
        $scope.processing = false;
        $scope.email = '';
        $scope.password = '';
    }

    function finishedLogin() {
        $scope.failed = false;
        $scope.processing = false;
    }

    $scope.loginSubmit = function () {
        $scope.processing = true;

        Authentication
            .login($scope.email, $scope.password)
            .then(finishedLogin, clearLoginForm);
    };

    // If we're already logged in
    if ($rootScope.loggedin) {
        $location.url('/');
    }

    finishedLogin();
}];
