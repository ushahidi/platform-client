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
            RoleEndpoint.query().$promise.then(function (roles) {
                $scope.roles = roles;
            });

            $scope.cancel = function () {
            };

            $scope.applyFilters = function () {
                UserEndpoint.queryFresh({
                    offset: ($scope.currentPage - 1) * $scope.itemsPerPage,
                    limit: $scope.itemsPerPage,
                    role: $scope.filter.role,
                    q: $scope.filter.q
                }).$promise.then(function (usersResponse) {
                    $scope.users = usersResponse.results;
                    $scope.totalItems = usersResponse.total_count;
                });
            };
        }];
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/common/filter-system/filter-users.html',
        scope: {
            query: '=',
            users: '='
        },
        controller: controller
    };
}];
