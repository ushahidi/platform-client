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
    'Session',
function (
    $scope,
    $rootScope,
    $translate,
    $location,
    $routeParams,
    UserEndpoint,
    Notify,
    _,
    RoleEndpoint,
    Session
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
            $scope.saving = false;
        });
    };

    var handleResponseErrors = function (errorResponse) {
        Notify.apiErrors(errorResponse);
    };

    var checkAndNotifyAboutManipulateOwnUser = function (translationKey) {
        var currentUserId = Session.getSessionDataEntry('userId');
        if (_.contains($scope.selectedUsers, currentUserId)) {
            Notify.error(translationKey);
            return true;
        }
        return false;
    };

    $scope.deleteUser = function (user) {
        if (checkAndNotifyAboutManipulateOwnUser('user.cannot_delete_yourself')) {
            return;
        }
        Notify.confirmDelete('notify.user.destroy_confirm').then(function () {
            UserEndpoint.delete({ id: user.id }).$promise.then(function () {
                Notify.notify('notify.user.destroy_success');
            }, handleResponseErrors);
            $location.url('/settings/users');
        }, function () {});
    };

    $scope.cancel = function () {
        $location.path('/settings/users');
    };

    RoleEndpoint.query().$promise.then(function (roles) {
        $scope.roles = _.indexBy(roles, 'name');
    });
}];
