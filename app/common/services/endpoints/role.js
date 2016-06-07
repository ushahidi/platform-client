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

    if (!(cache = CacheFactory.get('roleCache'))) {
        cache = new CacheFactory('roleCache');
    }

    var RoleEndpoint = $resource(Util.apiUrl('/roles/:id'), {
            id: '@id'
        }, {
        query: {
            method: 'GET',
            isArray: true,
            transformResponse: function (data /*, header*/) {
                return Util.transformResponse(data).results;
            }
        },
        get: {
            method: 'GET',
            cache: cache
        },
        update: {
            method: 'PUT'
        },
        deleteEntity: {
            method: 'DELETE'
        }
    });

    RoleEndpoint.getFresh = function (params) {
        cache.remove(Util.apiUrl('/roles/' + params.id));
        return RoleEndpoint.get(params);
    };

    RoleEndpoint.invalidateCache = function () {
        return cache.removeAll();
    };

    RoleEndpoint.queryFresh = function () {
        cache.removeAll();
        return RoleEndpoint.query();
    };

    RoleEndpoint.saveCache = function (item) {
        var persist = item.id ? RoleEndpoint.update : RoleEndpoint.save;
        cache.removeAll();
        var result = persist(item);
        return result;
    };

    RoleEndpoint.delete = function (item) {
        cache.removeAll();
        return RoleEndpoint.deleteEntity(item);
    };

    return RoleEndpoint;

}];
