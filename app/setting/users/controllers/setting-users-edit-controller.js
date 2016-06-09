module.exports = [
    '$scope',
    '$rootScope',
    '$translate',
    '$location',
    '$routeParams',
    'UserEndpoint',
    'Notify',
    '_',
    'RoleEndpoint',
function (
    $scope,
    $rootScope,
    $translate,
    $location,
    $routeParams,
    UserEndpoint,
    Notify,
    _,
    RoleEndpoint
) {

    // Redirect to home if not authorized
    if ($rootScope.hasManageSettingsPermission() === false) {
        return $location.path('/');
    }

    $translate('user.edit_user').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

    $scope.passwordShown = true;

    UserEndpoint.getFresh({id: $routeParams.id}).$promise.then(function (user) {
        $scope.$emit('setPageTitle', $scope.title + ' - ' + user.realname);
        $scope.user = user;
        $scope.passwordShown = false;
    });

    $scope.showPassword = function () {
        $scope.passwordShown = true;
    };

    $scope.saving = false;

    $scope.saveUser = function (user) {
        $scope.saving = true;
        UserEndpoint.saveCache(user).$promise.then(function (response) {
            if (response.id) {
                Notify.notify('notify.user.edit_success', {name: user.realname});
                $scope.saving = false;
                $scope.userSavedUser = true;
                $scope.user.id = response.id;
            }
            $location.path('/settings/users');
        }, function (errorResponse) { // error
            var validationErrors = [];
            // @todo refactor limit handling
            _.each(errorResponse.data.errors, function (value, key) {
                // Ultimately this should check individual status codes
                // for the moment just check for the message we expect
                if (value.title === 'limit::admin') {
                    Notify.limit('limit.admin_limit_reached');
                } else {
                    validationErrors.push(value);
                }
            });

            Notify.apiErrors(validationErrors);

            $scope.saving = false;
        });
    };

    $scope.cancel = function () {
        $location.path('/settings/users');
    };

    RoleEndpoint.query().$promise.then(function (roles) {
        $scope.roles = roles;
    });
}];
