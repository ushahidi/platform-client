module.exports = [
    '$translate',
    '$rootScope',
    '_',
    'ConfigEndpoint',
    'Notify',
    'Util',
    'Languages',
    'Features',
function (
    $translate,
    $rootScope,
    _,
    ConfigEndpoint,
    Notify,
    Util,
    Languages,
    Features
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
        },
        templateUrl: 'templates/settings/settings-list.html',
        link: function ($scope, $element, $attrs) {
            $scope.hasPermission = $rootScope.hasPermission;
            $scope.hasManageSettingsPermission = $rootScope.hasManageSettingsPermission;

            Features.loadFeatures().then(function () {
                $scope.planIsAvailable = Features.isViewEnabled('plan');
                ConfigEndpoint.get({id: 'site'}).$promise.then(function (site) {
                    $scope.tier = site.tier;
                });
            });
        }
    };
}];
