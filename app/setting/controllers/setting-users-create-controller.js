module.exports = [
    '$scope',
    '$rootScope',
    '$translate',
    '$location',
    'UserEndpoint',
    'Notify',
    '_',
    'RoleHelper',
function (
    $scope,
    $rootScope,
    $translate,
    $location,
    UserEndpoint,
    Notify,
    _,
    RoleHelper
) {
    $translate('user.add_user').then(function (title) {
        $scope.title = title;
        $rootScope.$emit('setPageTitle', title);
    });

    $scope.user = {};
    $scope.processing = false;

    $scope.saveUser = function (user) {
        $scope.processing = true;
        UserEndpoint.saveCache(user).$promise.then(function (response) {
            if (response.id) {
                $translate('notify.user.save_success', {name: user.realname}).then(function (message) {
                    Notify.showNotificationSlider(message);
                });
                $scope.processing = false;
                $scope.userSavedUser = true;
                $scope.user.id = response.id;
                $location.path('/settings/users/' + response.id);
            }
        }, function (errorResponse) { // error
            var validationErrors = [];
            // @todo refactor limit handling
            _.each(errorResponse.data.errors, function (value, key) {
                // Ultimately this should check individual status codes
                // for the moment just check for the message we expect
                if (value.title === 'limit::admin') {
                    $translate('limit.admin_limit_reached').then(function (message) {
                        Notify.showLimitSlider(message);
                    });
                } else {
                    validationErrors.push(value);
                }
            });

            Notify.showApiErrors(validationErrors);
            $scope.processing = false;
        });
    };

    $scope.roles = RoleHelper.roles(true);
}];
