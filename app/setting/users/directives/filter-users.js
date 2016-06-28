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
        '$timeout',
        'RoleEndpoint',
        'UserEndpoint',
        '_',
        function (
            $scope,
            $rootScope,
            $translate,
            $timeout,
            RoleEndpoint,
            UserEndpoint,
            _
        ) {
            $scope.filtersMenuOpen = false;
            $scope.cancel = function () {
                // Reset filters
                $scope.usersFiltersForm.$rollbackViewValue();
                // and close dropdown
                $scope.filtersMenuOpen = false;
            };

            $scope.applyFilters = function () {
                // ngFormController automatically commits changes to the model ($scope.filters)
                // Just close the dropdown
                $scope.filtersMenuOpen = false;
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
