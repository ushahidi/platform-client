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

    return ConfigEndpoint;

}];
