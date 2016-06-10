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
            $scope.whereToNext = 'settings/roles';

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

            $scope.cancel = function () {
                $location.path($scope.whereToNext);
            };

            $scope.saveRole = function (role) {
                $scope.saving = true;
                role.name = role.name ? role.name : role.display_name;

                RoleEndpoint.saveCache(role).$promise.then(function (result) {
                    Notify.notify('notify.role.save_success', {role: role.display_name});
                    $location.path($scope.whereToNext);
                }, function (errorResponse) { // error
                    Notify.apiErrors(errorResponse);
                });
                $scope.saving = false;
            };

            var handleResponseErrors = function (errorResponse) {
                Notify.apiErrors(errorResponse);
            };

            $scope.checkIfLastAdmin = function () {
                var admins = 0;
                _.each($scope.roles, function (role) {
                    if (role.name === 'admin') {
                        admins++;
                    }
                });

                return admins === 1;
            };

            $scope.deleteRole = function (role) {
                if (role.name === 'admin' && $scope.checkIfLastAdmin()) {
                    Notify.error('notify.role.last_admin');
                    return;
                }

                Notify.confirmDelete('notify.role.delete_question', {
                    role: role.display_name
                }).then(function () {
                    RoleEndpoint.delete({ id: role.id }).$promise.then(function () {
                        Notify.notify('notify.role.destroy_success', {
                            role: role.display_name
                        });
                        $location.path($scope.whereToNext);
                    }, handleResponseErrors);
                });
            };
        }
    };
}];
