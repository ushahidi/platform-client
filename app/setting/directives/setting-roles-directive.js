module.exports = [
    '$translate',
    '$location',
    'RoleEndpoint',
    'Notify',
    '_',
    'Features',
function (
    $translate,
    $location,
    RoleEndpoint,
    Notify,
    _,
    Features
) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
            $scope.refreshView = function () {
                RoleEndpoint.queryFresh().$promise.then(function (roles) {
                    $scope.roles = roles;
                });
            };

            $scope.refreshView();
            Features.loadFeatures().then(function () {
                $scope.rolesEnabled = Features.isFeatureEnabled('roles');
            });
        }
    };
}];
