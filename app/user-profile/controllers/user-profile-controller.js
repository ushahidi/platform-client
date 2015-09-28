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
        changingPassword: false,
        password: ''
    };

    $scope.saveUser = function (user) {
        $scope.state.success = false;
        $scope.state.processing = true;

        var userPayload = angular.copy(user);

        // If we're not changing the password, drop that property from payload (just in case.)
        if ($scope.state.changingPassword) {
            userPayload.password = $scope.state.password;
        }

        var update = UserEndpoint.update({ id: 'me' }, userPayload);

        update.$promise.then(function (user) {
            $scope.state.success = true;
            $scope.state.processing = false;

            // Collapse password change form field.
            $scope.state.changingPassword = false;
            $scope.state.password = '';

            $scope.user = user;
        }, function (errorResponse) { // error
            Notify.showApiErrors(errorResponse);
            $scope.state.processing = false;
        });
    };

    $scope.user = user;
}];
