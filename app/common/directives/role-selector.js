/**
 * Ushahidi Angular Role Selector directive
 * Drop in directive for managing roles addition for users
 * and posts
 */

module.exports = [
function (
) {
    var controller = [
        '$scope',
        '$rootScope',
        '$translate',
        'Notify',
        'RoleEndpoint',
        '_',
        function (
            $scope,
            $rootScope,
            $translate,
            Notify,
            RoleEndpoint,
            _
        ) {
            // This directive has two states 'role' and 'permission'
            // in permission state it returns an array of roles via a provided function
            // in role state it returns a single role via a provided function
            // Default state for role selector is selecting permissions for entities
            $scope.fieldType = 'checkbox';
            $scope.title = 'post.who_can_see_this';

            if ($scope.mode === 'role') {
                $scope.fieldType = 'radio';
                $scope.title = 'user.change_role';
            }

            RoleEndpoint.query().$promise.then(function (roles) {
                $scope.roles = roles;
            });

            $scope.checkIfAllSelected = function () {
                return ($scope.roles.length === $scope.selectedRoles.length());
            };

            $scope.togglePermission = function (role) {
                if (role === 'draft' || role === '' || $scope.checkifAllSelected()) {
                    $scope.selectedRoles = [];
                }

                $scope.toggleRoleFunc({roles: $scope.selectedRoles});
            };

            $scope.toggleRole = function (role) {
                $scope.toggleRoleFunc({roles: role});
            };

        }];
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/common/role-selector/role-selector.html',
        scope: {
            selectedRoles: '=',
            mode: '=',
            toggleRoleFunc: '&'
        },
        controller: controller
    };
}];
