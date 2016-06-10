module.exports = PasswordResetConfirmDirective;

PasswordResetConfirmDirective.$inject = [];
function PasswordResetConfirmDirective() {
    return {
        restrict: 'E',
        scope: true,
        controller: PasswordResetConfirmController,
        templateUrl: 'templates/auth/password-reset-confirm.html'
    };
}
PasswordResetConfirmController.$inject = [
    '$scope',
    '$translate',
    'PasswordReset',
    'Authentication',
    'Notify'
];
function PasswordResetConfirmController(
    $scope,
    $translate,
    PasswordReset,
    Authentication,
    Notify
) {
    $scope.failed = false;
    $scope.processing = false;
    $scope.token = $scope.token || '';
    $scope.hasToken = false;
    $scope.password = '';

    $scope.submit = submit;
    $scope.cancel = cancel;

    activate();

    function activate() {
        // If we're already logged in
        if (Authentication.getLoginStatus()) {
            $scope.$parent.closeModal();
        }
        $scope.hasToken = !!$scope.token;
    }

    function resetSuccess() {
        $scope.processing = false;

        Notify.notify('notify.passwordreset.success');
        Authentication.openLogin();
    }

    function resetFailed(errorResponse) {
        $scope.failed = true;
        $scope.processing = false;

        Notify.apiErrors(errorResponse);
    }

    function submit() {
        $scope.processing = true;

        PasswordReset
            .resetConfirm($scope.token, $scope.password)
            .then(resetSuccess, resetFailed);
    }

    function cancel() {
        $scope.$parent.closeModal();
    }
}
