module.exports = [
    '$scope',
    '$rootScope',
    '$translate',
    'UserEndpoint',
    'Notify',
    '_',
    'user',
function (
    $scope,
    $rootScope,
    $translate,
    UserEndpoint,
    Notify,
    _,
    user
) {
    $translate('user_profile.title').then(function (title) {
        $scope.title = title;
        $rootScope.$emit('setPageTitle', title);
    });

    $scope.state = {
        success: false,
        processing: false,
        changingPassword: false
    };

    $scope.saveUser = function (user) {
        $scope.state.success = false;
        $scope.state.processing = true;

        var userPayload = angular.copy(user);

        // Clear password from rendered space.
        user.password = null;

        // If we're not changing the password, drop that property from payload (just in case.)
        if (!$scope.state.changingPassword) {
            delete userPayload.password;
        }

        // Hide password change form field.
        $scope.state.changingPassword = false;

        UserEndpoint.update({ id: 'me' }, userPayload, function (user) {
            $scope.state.success = true;
            $scope.state.processing = false;

            $scope.user = user;
        }, function (errorResponse) { // error
            var errors = _.pluck(errorResponse.data && errorResponse.data.errors, 'message');
            errors && Notify.showAlerts(errors);
            $scope.state.processing = false;
        });
    };

    $scope.user = user;
}];
