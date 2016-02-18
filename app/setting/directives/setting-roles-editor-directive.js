module.exports = [
    '$translate',
    '$location',
    '$routeParams',
    '$route',
    'RoleEndpoint',
    'PermissionEndpoint',
    'Notify',
function (
    $translate,
    $location,
    $routeParams,
    $route,
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

            $scope.saveRole = function (role, addAnother) {
                $scope.processing = true;
                role.name = role.name ? role.name : role.display_name;
                var whereToNext = 'settings/roles';

                RoleEndpoint.saveCache(role).$promise.then(function (result) {
                    $translate('notify.role.save_success', {role: role.display_name}).then(function (message) {
                        Notify.showNotificationSlider(message);
                        addAnother ? $route.reload() : $location.path(whereToNext);
                    });
                }, function (errorResponse) { // error
                    Notify.showApiErrors(errorResponse);
                });
                $scope.processing = false;
            };
        }
    };
}];
