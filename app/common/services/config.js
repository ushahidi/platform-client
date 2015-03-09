module.exports = [
    'ConfigEndpoint',
    'Util',
function(
    ConfigEndpoint,
    Util
) {

    var saving = {};

    var Config = {
        map      : ConfigEndpoint.get({ id: 'map'      }),
        site     : ConfigEndpoint.get({ id: 'site'     }),
        features : ConfigEndpoint.get({ id: 'features' }),
        saving: function(id)
        {
            return !!saving[id];
        },
        update: function(id, model)
        {
            saving[id] = true;
            model.$update({ id: id }, function() {
                // @todo show alertify (or similar) message here
                saving[id] = false;
            });
        },
        toggleFeature: function(feature, enabled)
        {
            this.features[feature] = enabled;
            this.update('features', this.features);
        }
    };

    return Util.bindAllFunctionsToSelf(Config);

}];
