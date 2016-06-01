/**
 * Ushahidi Angular Filter System role directive
 * Drop in directive responsible for role selection
 * for filtering
 */

module.exports = [
function (
) {
    var controller = [
        '$scope',
        '$rootScope',
        '$translate',
        'RoleEndpoint',
        function (
            $scope,
            $rootScope,
            $translate,
            RoleEndpoint
        ) {
            RoleEndpoint.query().$promise.then(function (roles) {
                $scope.roles = roles;
            });
        }];
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/common/filter-system/filter-role.html',
        scope: {
            model: '='
        },
        controller: controller
    };
}];
