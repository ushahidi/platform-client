module.exports = [
    'ConfigEndpoint',
    'Util',
function (
    ConfigEndpoint,
    Util
) {

    var saving = {};

    var Config = {
        map  : ConfigEndpoint.get({ id: 'map' }),
        site : ConfigEndpoint.get({ id: 'site' }),

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
