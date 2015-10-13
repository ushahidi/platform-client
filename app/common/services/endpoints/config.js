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
    var cache = new CacheFactory('configCache');

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
        var result = persist(item).$promise.then(function () {
            cache.put(Util.apiUrl(result.id), item);
        });
        return result;
    };

    return ConfigEndpoint;
}];
