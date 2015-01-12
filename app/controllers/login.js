module.exports = [
    '$scope',
    'Authentication',
function(
    $scope,
    Authentication
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

    finishedLogin();
}];
