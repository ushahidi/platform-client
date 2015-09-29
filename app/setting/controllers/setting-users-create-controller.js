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

    $scope.validationErrors = [];
    $scope.saveUser = function (user) {
        $scope.processing = true;
        var response = UserEndpoint.save(user, function () {
            if (response.id) {
                $scope.processing = false;
                $scope.userSavedUser = true;
                $scope.user.id = response.id;
            }
        }, function (errorResponse) { // error
            _.each(errorResponse.data.errors, function (value, key) {
                // Ultimately this should cehck individual status codes
                // for the moment just check for the message we expect
                if (value.title === 'limit::admin') {
                    $scope.adminLimitReached = true;
                } else {
                    $scope.validationErrors.push(value);
                }

            });

            $scope.processing = false;
        });
    };

    $scope.roles = RoleHelper.roles(true);
}];
