module.exports = [
    '$scope',
    '$rootScope',
    '$translate',
    '$location',
    '$route',
    'UserEndpoint',
    'Notify',
    '_',
    'RoleEndpoint',
function (
    $scope,
    $rootScope,
    $translate,
    $location,
    $route,
    UserEndpoint,
    Notify,
    _,
    RoleEndpoint
) {

    // Redirect to home if not authorized
    if ($rootScope.hasManageSettingsPermission() === false) {
        return $location.path('/');
    }

    $translate('user.add_user').then(function (title) {
        $scope.title = title;
        $rootScope.$emit('setPageTitle', title);
    });

    $scope.passwordShown = true;
    $scope.user = { role: 'user' }; // @todo don't hardcode default role
    $scope.save = $translate.instant('app.save');
    $scope.saving = $translate.instant('app.saving');
    $scope.saving_user = false;
    $scope.saveUser = function (user, addAnother) {
        $scope.saving_user = true;
        var whereToNext = '/settings/users';

        UserEndpoint.saveCache(user).$promise.then(function (response) {
            if (response.id) {
                Notify.notify('notify.user.save_success', {name: user.realname});
                $scope.saving_user = false;
                $scope.userSavedUser = true;
                $scope.user.id = response.id;
                addAnother ? $route.reload() : $location.path(whereToNext);
            }
        }, function (errorResponse) { // error
            var validationErrors = [],
                limitError = false;
            // @todo refactor limit handling
            _.each(errorResponse.data.errors, function (value, key) {
                // Ultimately this should check individual status codes
                // for the moment just check for the message we expect
                if (value.title === 'limit::admin') {
                    limitError = 'limit.admin_limit_reached';
                } else {
                    validationErrors.push(value);
                }
            });

            if (limitError) {
                Notify.limit(limitError);
            } else {
                Notify.errors(_.pluck(validationErrors, 'message'));
            }
            $scope.saving_user = false;
        });
    };

    $scope.cancel = function () {
        $location.path('/settings/users');
    };

    RoleEndpoint.query().$promise.then(function (roles) {
        $scope.roles = _.indexBy(roles, 'name');
    });
}];
