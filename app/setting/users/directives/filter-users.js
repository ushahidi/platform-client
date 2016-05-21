/**
 * Ushahidi Angular Filter System User directive
 * Drop in directive for managing filters for users
 */

module.exports = [
function (
) {
    var controller = [
        '$scope',
        '$rootScope',
        '$translate',
        'RoleEndpoint',
        'UserEndpoint',
        '_',
        function (
            $scope,
            $rootScope,
            $translate,
            RoleEndpoint,
            UserEndpoint,
            _
        ) {
            $scope.selectedRoles = [];
            RoleEndpoint.query().$promise.then(function (roles) {
                $scope.roles = roles;
            });

            $scope.cancel = function () {
                //TODO: check expected behaviour - should close dropdown
            };

            $scope.applyFilters = function () {
                $scope.filters.roles = $scope.selectedRoles;
            };
        }];
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/settings/users/filter-users.html',
        scope: {
            filters: '='
        },
        controller: controller
    };
}];
