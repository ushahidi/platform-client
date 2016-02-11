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
            isArray: true,
            transpermissionResponse: function (data /*, header*/) {
                return Util.transformResponse(data).results;
            }
        },
        get: {
            method: 'GET',
            cache: cache
        }
    });

    PermissionEndpoint.getFresh = function (id) {
        cache.remove(Util.apiUrl(id));
        return PermissionEndpoint.get(id);
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
