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
        var response = UserEndpoint.save(user, function () {
            if (response.id) {
                $location.path('/settings/users/' + response.id);
            }
        }, function (errorResponse) { // error
            var errors = _.pluck(errorResponse.data && errorResponse.data.errors, 'message');
            errors && Notify.showAlerts(errors);
            $scope.processing = false;
        });
    };

    $scope.roles = RoleHelper.roles(true);
}];
