module.exports = [
    'ConfigEndpoint',
    'Util',
function (
    ConfigEndpoint,
    Util
) {

    var Features = {
        clientFeatures: {},
        reloadFeatures: function () {
            ConfigEndpoint.get({id: 'features'}).$promise.then(function (features) {
                Features.clientFeatures = features;
            });
        },
        isFeatureEnabled: function (feature) {
            return Features.clientFeatures[feature].enabled;
        },
        isViewEnabled: function (view) {
            return Features.clientFeatures.views[view];
        },
        getLimit: function (feature) {
            return Features.clientFeatures.limits[feature];
        }
    };

    Features.reloadFeatures();
    return Util.bindAllFunctionsToSelf(Features);
}];
