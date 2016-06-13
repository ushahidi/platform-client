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
        cache = new CacheFactory('configCache', { storageMode : 'memory' });
    }

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

    ConfigEndpoint.invalidateCache = function () {
        return cache.removeAll();
    };

    ConfigEndpoint.getFresh = function (params) {
        cache.remove(Util.apiUrl('/config/' + params.id));
        return ConfigEndpoint.get(params);
    };

    /**
     * saveCache is responsible for both creation and update of an entity
     * the switch between update and save is determined based on the presence of
     * the entity's id.
     * When we get a full entity for edit we use getFresh to ensure it's the most
     * up to date. Once the save takes place we need to invalidate the associated:w
     *
     * cache to ensure that the query - where appropriate - is cleared.
     *
     */
    ConfigEndpoint.saveCache = function (item) {
        var persist = item.id ? ConfigEndpoint.update : ConfigEndpoint.save;

        cache.removeAll();
        return persist(item);
    };

    return ConfigEndpoint;
}];
