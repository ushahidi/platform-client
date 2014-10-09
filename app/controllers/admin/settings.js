module.exports = ['$scope', 'ConfigSiteData', 'ConfigFeaturesData', function($scope, ConfigSiteData, ConfigFeaturesData) {
    $scope.title = 'Admin: Settings';

    $scope.sites = ConfigSiteData.query();
    $scope.features = ConfigFeaturesData.query();

}];
