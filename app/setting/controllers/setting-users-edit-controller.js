module.exports = [
    '$scope',
    '$rootScope',
    '$translate',
    '$location',
    '$routeParams',
    'UserEndpoint',
    'Notify',
    '_',
    'RoleHelper',
function (
    $scope,
    $rootScope,
    $translate,
    $location,
    $routeParams,
    UserEndpoint,
    Notify,
    _,
    RoleHelper
) {
    $translate('user.edit_user').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

    $scope.user = UserEndpoint.get({id: $routeParams.id}, function (user) {
        $scope.$emit('setPageTitle', $scope.title + ' - ' + user.realname);
    });

    $scope.processing = false;

    $scope.validationErrors = [];
    $scope.saveUser = function (user) {
        $scope.processing = true;
        var response = UserEndpoint.update({id: $routeParams.id}, user, function () {
            if (response.id) {
                $translate('user.saved_user').then(function (message) {
                    Notify.showNotificationSlider(message);
                });  
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
