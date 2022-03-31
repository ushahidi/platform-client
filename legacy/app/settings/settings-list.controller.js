module.exports = [
    '$translate',
    '$rootScope',
    '_',
    'ConfigEndpoint',
    'Features',
    '$scope',
    function (
        $translate,
        $rootScope,
        _,
        ConfigEndpoint,
        Features,
        $scope
    ) {
        $scope.isAdmin = $rootScope.isAdmin;
        $scope.hasPermission = $rootScope.hasPermission;
        $scope.hasManageSettingsPermission =
        $rootScope.hasManageSettingsPermission;

        $scope.dataExportTitle = 'settings.settings_list.export';
        $scope.dataExportDescription = 'settings.settings_list.export_desc';

        Features.loadFeatures().then(function () {
            $scope.userSettingsEnabled = Features.isFeatureEnabled(
                'user-settings'
            );
            $scope.hxlEnabled = Features.isFeatureEnabled('hxl');
            $scope.donationEnabled = Features.isFeatureEnabled('donation');

            // adjusting title/description of data-export based on if hxl is enabled
            if ($scope.hxlEnabled) {
                $scope.dataExportTitle = 'settings.settings_list.export_hxl';
                $scope.dataExportDescription =
                    'settings.settings_list.export_desc_hxl';
            }

            ConfigEndpoint.get({ id: 'site' }).$promise.then(function (site) {
                $scope.tier = site.tier;
            });
        });
    }
];
