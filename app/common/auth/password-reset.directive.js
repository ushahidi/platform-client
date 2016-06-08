module.exports = PasswordResetDirective;

PasswordResetDirective.$inject = [];
function PasswordResetDirective() {
    return {
        restrict: 'E',
        scope: true,
        controller: PasswordResetController,
        templateUrl: 'templates/auth/password-reset.html'
    };
}
PasswordResetController.$inject = [
    '$scope',
    'PasswordReset',
    'Authentication'
];
function PasswordResetController(
    $scope,
    PasswordReset,
    Authentication
) {
    $scope.processing = false;
    $scope.email = '';

    $scope.submit = submit;
    $scope.cancel = cancel;

    activate();

    function activate() {
        // If we're already logged in
        if (Authentication.getLoginStatus()) {
            $scope.$parent.closeModal();
        }
    }

    $scope.processing = false;

    function resetDone() {
        $scope.processing = false;
        PasswordReset.openResetConfirm();
    }

    function submit() {
        $scope.processing = true;

        PasswordReset
            .reset($scope.email)
            .finally(resetDone);
    }

    function cancel() {
        $scope.$parent.closeModal();
    }
}
