module.exports = [
    '$scope',
    '$translate',
    'RoleEndpoint',
    'PermissionEndpoint',
function (
    $scope,
    $translate,
    RoleEndpoint,
    PermissionEndpoint
) {
    $translate('tool.manage_roles').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

}];
