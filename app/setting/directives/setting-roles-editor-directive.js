module.exports = [
    '$translate',
    '$location',
    '$routeParams',
    'RoleEndpoint',
    'PermissionEndpoint',
    'Notify',
function (
    $translate,
    $location,
    $routeParams,
    RoleEndpoint,
    PermissionEndpoint,
    Notify
) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {

            RoleEndpoint.getFresh({id: $routeParams.id}).$promise.then(function (role) {
                $scope.role = role;

                $scope.title = $scope.role.id ? 'role.edit_role' : 'role.add_role';

                $translate($scope.title).then(function (title) {
                    $scope.title = title;
                    $scope.$emit('setPageTitle', title);
                });
            });


            PermissionEndpoint.query().$promise.then(function (permissions) {
                $scope.permissions = permissions.results;
            });

            $scope.saveRole = function (role) {
                $scope.processing = true;
                role.name = role.name === '' ? role.display_name : role.name;

                RoleEndpoint.saveCache(role).$promise.then(function (result) {
                    $translate('notify.role.save_success', {role: role.display_name}).then(function (message) {
                        Notify.showNotificationSlider(message);
                        $location.path('/settings/roles/' + result.id);
                    });
                }, function (errorResponse) { // error
                    Notify.showApiErrors(errorResponse);
                });
                $scope.processing = false;
            };
        }
    };
}];
