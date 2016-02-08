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
            $scope.roles = RoleEndpoint.query();

            $scope.userRoleSet = function (role) {
                return _.contains($scope.currentRoles, String(role.id));
            };

            $scope.toggleRole = function (role) {
                $scope.toggleRoleFunc(role);
            };

        }];
    return {
        restrict: 'E',
        templateUrl: 'templates/role-selector/role-selector.html',
        scope: {
            currentRoles: '=',
            toggleRoleFunc: '='
        },
        controller: controller
    };
}];
