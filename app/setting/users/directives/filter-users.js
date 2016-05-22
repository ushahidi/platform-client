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

            $scope.cancel = function () {
                //TODO: check expected behaviour - should close dropdown
            };

            $scope.applyFilters = function () {
                // If the objects are directly linked the watch will be fired
                // each time a role is clicked, so instead we copy the object
                $scope.filters.q = angular.copy($scope.usersFiltersForm.q.$viewValue);
                $scope.filters.role = angular.copy($scope.selectedRoles);
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
