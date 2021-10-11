module.exports = [
    '$translate',
    '$rootScope',
    '$location',
    'RoleEndpoint',
    '_',
    'Features',
function (
    $translate,
    $rootScope,
    $location,
    RoleEndpoint,
    _,
    Features
) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
            $rootScope.setLayout('layout-a');
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
