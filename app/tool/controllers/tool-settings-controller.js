module.exports = [
    '$scope',
    '$rootScope',
    '$translate',
    'ConfigEndpoint',
function(
    $scope,
    $rootScope,
    $translate,
    ConfigEndpoint
) {

    $translate('tool.site_settings').then(function(title) {
        $scope.title = title;
        $rootScope.$emit('setPageTitle', title);
    });

    $scope.saving_config = {};

    $scope.site = ConfigEndpoint.get({ id: 'site' });
    $scope.features = ConfigEndpoint.get({ id: 'features' });

    $scope.updateConfig = function(id, model)
    {
        $scope.saving_config[id] = true;
        model.$update({ id: id }, function() {
            // @todo show alertify (or similar) message here
            $scope.saving_config[id] = false;
        });
    };

    $scope.toggleFeature = function(feature, enabled)
    {
        $scope.features[feature] = enabled;
        $scope.updateConfig('features', $scope.features);
    };

}];
