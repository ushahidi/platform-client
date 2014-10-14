module.exports = ['$scope', 'ConfigSiteEndpoint', 'ConfigFeaturesEndpoint', function($scope, ConfigSiteEndpoint, ConfigFeaturesEndpoint) {
    $scope.title = 'Admin: Settings';

    $scope.site = ConfigSiteEndpoint.get();
    $scope.features = ConfigFeaturesEndpoint.get();

}];
