module.exports = ['$scope', 'ConfigSiteData', 'ConfigFeaturesData', function($scope, ConfigSiteData, ConfigFeaturesData) {
    $scope.title = 'Admin: Settings';

    $scope.site = ConfigSiteData.get();
    $scope.features = ConfigFeaturesData.get();

}];
