module.exports = [
    '$resource',
    'Util',
    'CacheFactory',
function (
    $resource,
    Util,
    CacheFactory
) {
    var cache;

    if (!(cache = CacheFactory.get('permissionCache'))) {
        cache = new CacheFactory('permissionCache');
    }

    cache.setOnExpire(function (key, value) {
        PermissionEndpoint.get(value.id);
    });

    var PermissionEndpoint = $resource(Util.apiUrl('/permissions/:id'), {
            id: '@id'
        }, {
        query: {
            method: 'GET',
            transpermissionResponse: function (data /*, header*/) {
                return Util.transformResponse(data).results;
            }
        },
        get: {
            method: 'GET',
            cache: cache
        }
    });

    PermissionEndpoint.getFresh = function (params) {
        cache.remove(Util.apiUrl('/permissions/' + params.id));
        return PermissionEndpoint.get(params);
    };

    PermissionEndpoint.invalidateCache = function () {
        return cache.removeAll();
    };

    PermissionEndpoint.queryFresh = function () {
        cache.removeAll();
        return PermissionEndpoint.query();
    };

    return PermissionEndpoint;

}];
