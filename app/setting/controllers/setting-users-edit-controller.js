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

    $scope.saveUser = function (user) {
        $scope.processing = true;
        var response = UserEndpoint.update({id: $routeParams.id}, user, function () {
            if (response.id) {
                $translate('notify.user.edit_success', {name: user.realname}).then(function (message) {
                    Notify.showNotificationSlider(message);
                });
                $scope.processing = false;
                $scope.userSavedUser = true;
                $scope.user.id = response.id;
            }
            $rootScope.goBack();
        }, function (errorResponse) { // error
            Notify.showApiErrors(errorResponse);
            $scope.processing = false;
        });
    };

    $scope.roles = RoleHelper.roles(true);
}];
