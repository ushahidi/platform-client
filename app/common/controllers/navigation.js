module.exports = [
    '$scope',
    'Authentication',
    'ConfigEndpoint',
function (
    $scope,
    Authentication,
    ConfigEndpoint
) {

    $scope.site = ConfigEndpoint.get({ id: 'site' });
    $scope.features = ConfigEndpoint.get({ id: 'features' });

    $scope.logoutClick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        Authentication.logout();
    };

}];
