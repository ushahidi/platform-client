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

    UserEndpoint.getFresh({id: $routeParams.id}).$promise.then(function (user) {
        $scope.$emit('setPageTitle', $scope.title + ' - ' + user.realname);
        $scope.user = user;
    });

    $scope.processing = false;

    $scope.saveUser = function (user) {
        $scope.processing = true;
        UserEndpoint.saveCache(user).$promise.then(function (response) {
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
