module.exports = [
    '$scope',
    '$translate',
    'ConfigEndpoint',
function(
    $scope,
    $translate,
    ConfigEndpoint
) {

    $translate('settings.site').then(function(settingsTranslation){
        $scope.title = settingsTranslation;
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
