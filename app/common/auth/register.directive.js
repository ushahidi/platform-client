module.exports = RegisterDirective;

RegisterDirective.$inject = [];
function RegisterDirective() {
    return {
        restrict: 'E',
        scope: {},
        controller: RegisterController,
        templateUrl: 'templates/auth/register.html'
    };
}
RegisterController.$inject = [
    '$scope',
    '$translate',
    'Authentication',
    'Registration',
    'Notify'
];
function RegisterController(
    $scope,
    $translate,
    Authentication,
    Registration,
    Notify
) {
    $scope.failed = false;
    $scope.processing = false;
    $scope.realname = '';
    $scope.email = '';
    $scope.password = '';

    $scope.registerSubmit = registerSubmit;
    $scope.cancel = cancel;

    activate();

    function activate() {
        // If we're already logged in
        if (Authentication.getLoginStatus()) {
            $scope.$parent.closeModal();
        }
    }

    function registerSubmit() {
        $scope.processing = true;

        Registration
            .register($scope.realname, $scope.email, $scope.password)
            .then(registerSuccess, registerFailed);
    }

    function registerSuccess() {
        $scope.failed = false;
        $scope.processing = false;

        Notify.success('notify.register.success');
        Authentication.openLogin();
    }

    function registerFailed(errorResponse) {
        $scope.failed = true;
        $scope.processing = false;

        angular.forEach(errorResponse.data.errors, function (error) {
            if (!error.source || !error.source.pointer) {
                return;
            }

            // @todo parse jsonpath properly
            var index = error.source.pointer.replace('/', '');
            if ($scope.form[index]) {
                $scope.form[index].$setValidity(error.title, false);
                // Clear validation on next change
                $scope.form[index].$validators[error.title] = function () {
                    return true;
                };
            }
        });

        Notify.apiErrors(errorResponse);
    }

    function cancel() {
        $scope.$parent.closeModal();
    }
}
