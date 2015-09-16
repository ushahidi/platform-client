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
        UserEndpoint.update({id: $routeParams.id}, user, function () {
            $rootScope.goBack();
        }, function (errorResponse) { // error
            var errors = _.pluck(errorResponse.data && errorResponse.data.errors, 'message');
            errors && Notify.showAlerts(errors);
            $scope.processing = false;
        });
    };

    $scope.roles = RoleHelper.roles(true);
}];
