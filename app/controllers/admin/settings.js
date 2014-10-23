module.exports = ['$scope', '$translate', 'ConfigSiteEndpoint', 'ConfigFeaturesEndpoint', function($scope, $translate, ConfigSiteEndpoint, ConfigFeaturesEndpoint) {

    $translate('settings.admin_settings').then(function(settingsTranslation){
        $scope.title = settingsTranslation;
    });

    $scope.site = ConfigSiteEndpoint.get();
    $scope.features = ConfigFeaturesEndpoint.get();

}];
