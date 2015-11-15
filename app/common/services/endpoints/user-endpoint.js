module.exports = [
    '$resource',
    '$rootScope',
    'Util',
    'CacheFactory',
function (
    $resource,
    $rootScope,
    Util,
    CacheFactory
) {
    var cache;

    if (!(cache = CacheFactory.get('userCache'))) {
        cache = new CacheFactory('userCache');
    }

    cache.setOnExpire(function (key, value) {
        UserEndpoint.get(value.id);
    });

    var UserEndpoint = $resource(Util.apiUrl('/users/:id'), {
        id: '@id'
    }, {
        query: {
            method: 'GET',
            isArray: false,
            transformResponse: function (data /*, header*/) {
                return angular.fromJson(data);
            },
            cache: cache
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

    UserEndpoint.getFresh = function (id) {
        cache.remove(Util.apiUrl(id));
        return UserEndpoint.get(id);
    };

    UserEndpoint.invalidateCache = function () {
        return cache.removeAll();
    };

    UserEndpoint.queryFresh = function (params) {
        cache.removeAll();
        return UserEndpoint.query(params);
    };

    UserEndpoint.saveCache = function (item) {
        var persist = item.id ? UserEndpoint.update : UserEndpoint.save;
        cache.removeAll();
        return persist(item);
    };

    UserEndpoint.delete = function (item) {
        cache.removeAll();
        var result = UserEndpoint.deleteEntity(item);
        return result;
    };

    return UserEndpoint;
}];
