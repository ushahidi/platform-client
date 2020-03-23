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
        'zerorated': 'Social Impact',
        'demo_1' : 'Ushahidi Demo',
        'level_1': 'Ushahidi Basic'
    };
    $scope.dataExportTitle = 'settings.settings_list.export';
    $scope.dataExportDescription = 'settings.settings_list.export_desc';

    Features.loadFeatures().then(function () {
        $scope.planIsAvailable = Features.isViewEnabled('plan');
        $scope.userSettingsEnabled = Features.isFeatureEnabled('user-settings');
        $scope.hxlEnabled = Features.isFeatureEnabled('hxl');

        // adjusting title/description of data-export based on if hxl is enabled
        if ($scope.hxlEnabled) {
            $scope.dataExportTitle =  'settings.settings_list.export_hxl';
            $scope.dataExportDescription = 'settings.settings_list.export_desc_hxl';
        }

        ConfigEndpoint.get({id: 'site'}).$promise.then(function (site) {
            $scope.tier = site.tier;
        });
    });
}];
