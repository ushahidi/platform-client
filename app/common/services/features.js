module.exports = [
    'ConfigEndpoint',
    'Util',
    '$q',
function (
    ConfigEndpoint,
    Util,
    $q
) {

    var Features = {
        features: undefined,
        loadFeatures: function () {
            var deferred = $q.defer();
            if (Features.features) {
                deferred.resolve(Features.features);
            } else {
                ConfigEndpoint.getFresh({id: 'features'}).$promise.then(function (features) {
                    Features.features = features;
                    deferred.resolve(Features.features);
                });
            }
            return deferred.promise;
        },
        isFeatureEnabled: function (feature) {
            return Features.features[feature].enabled;
        },
        isViewEnabled: function (view) {
            return Features.features.views[view];
        },
        getLimit: function (feature) {
            return Features.features.limits[feature];
        }
    };

    return Util.bindAllFunctionsToSelf(Features);
}];
