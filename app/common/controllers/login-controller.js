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

    $scope.clearLoginForm = function () {
        $scope.failed = true;
        $scope.processing = false;
        $scope.email = '';
        $scope.password = '';
    }

    $scope.finishedLogin = function() {
        $scope.failed = false;
        $scope.processing = false;
    }

    $scope.loginSubmit = function () {
        $scope.processing = true;

        Authentication
            .login($scope.email, $scope.password)
            .then($scope.finishedLogin, $scope.clearLoginForm);
    };

    // If we're already logged in
    if ($rootScope.loggedin) {
        $location.url('/');
    }

    $scope.finishedLogin();
}];
