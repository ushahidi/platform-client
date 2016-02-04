module.exports = [
    '$scope',
    'RoleEndpoint',
    'PermissionEndpoint',
function (
    $scope,
    RoleEndpoint,
    PermissionEndpoint
) {
  
    RoleEndpoint.queryFresh().$promise.then(function (roles) {
        $scope.roles = roles.results;
    });

}];
