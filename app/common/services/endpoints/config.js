module.exports = [
    '$resource',
    'Util',
    '_',
    'CacheFactory',
function (
    $resource,
    Util,
    _,
    CacheFactory
) {
    var cache;

    if (!(cache = CacheFactory.get('configCache'))) {
        cache = new CacheFactory('configCache');
    }

    cache.setOnExpire(function (key, value) {
        ConfigEndpoint.get(value.id);
    });


    var ConfigEndpoint = $resource(Util.apiUrl('/config/:id'), {
        'id': '@id'
    }, {
        get: {
            method: 'GET',
            transformResponse: function (data /*, header*/) {
                return Util.transformResponse(data);
            },
            cache: cache
        },
        update: {
            method: 'PUT',
            transformResponse: function (data /*, header*/) {
                return Util.transformResponse(data);
            }
        }
    });

    ConfigEndpoint.getFresh = function (id) {
        cache.remove(Util.apiUrl(id));
        return ConfigEndpoint.get(id);
    };

    ConfigEndpoint.saveCache = function (item) {
        var persist = item.id ? ConfigEndpoint.update : ConfigEndpoint.save;

        cache.removeAll();
        return persist(item);
    };

    return ConfigEndpoint;
}];
