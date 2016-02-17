module.exports = [
    'ConfigEndpoint',
    'Util',
    'Notify',
    'BootstrapConfig',
    '_',
function (
    ConfigEndpoint,
    Util,
    BootstrapConfig,
    Notify,
    _
) {

    var saving = {};

    var Config = {
        map  : ConfigEndpoint.get({ id: 'map' }),
        site : ConfigEndpoint.get({ id: 'site' }),
        features : ConfigEndpoint.getFresh({ id: 'features' }),

        saving: function (id) {
            return !!saving[id];
        },

        update: function (id, model) {
            saving[id] = true;

            model.$update({ id: id }, function () {
                // @todo show alertify (or similar) message here
                saving[id] = false;
            });
        }
    };

    return Util.bindAllFunctionsToSelf(Config);

}];
