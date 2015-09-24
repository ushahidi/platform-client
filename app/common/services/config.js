module.exports = [
    'ConfigEndpoint',
    'BootstrapConfig',
    'Util',
function (
    ConfigEndpoint,
    BootstrapConfig,
    Util
) {

    var saving = {};

    var Config = {
        map  : BootstrapConfig.map,
        site : BootstrapConfig.site,
        features: BootstrapConfig.features,

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
