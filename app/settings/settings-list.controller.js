module.exports = [
    '$translate',
    '$rootScope',
    '_',
    'ConfigEndpoint',
    'Notify',
    'Util',
    'Languages',
    'Features',
    '$scope',
function (
    $translate,
    $rootScope,
    _,
    ConfigEndpoint,
    Notify,
    Util,
    Languages,
    Features,
    $scope
) {
    $scope.isAdmin = $rootScope.isAdmin;
    $scope.hasPermission = $rootScope.hasPermission;
    $scope.hasManageSettingsPermission = $rootScope.hasManageSettingsPermission;
    $scope.tierNames = {
        'free': 'Mapper',
        'surveyor': 'Surveyor',
        'responder': 'Responder',
        'free-pre-jun-2016': 'Mapper (Legacy)',
        'zerorated': 'Social Impact'
    };

    Features.loadFeatures().then(function () {
        $scope.planIsAvailable = Features.isViewEnabled('plan');
        ConfigEndpoint.get({id: 'site'}).$promise.then(function (site) {
            $scope.tier = site.tier;
        });
    });
}];
