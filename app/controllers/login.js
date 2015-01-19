module.exports = [
    '$scope',
    'Authentication',
    '$location',
function(
    $scope,
    Authentication,
    $location
) {
    function clearLoginForm() {
        $scope.failed = true;
        $scope.processing = false;
        $scope.username = '';
        $scope.password = '';
    }

    function finishedLogin() {
        $scope.failed = false;
        $scope.processing = false;
    }

    $scope.loginSubmit = function(){
        $scope.processing = true;

        Authentication
            .login($scope.username, $scope.password)
            .then(finishedLogin, clearLoginForm);
    };

    // If we're already logged in
    if (Authentication.getLoginStatus()) {
        $location.url('/');
    }

    finishedLogin();
}];
