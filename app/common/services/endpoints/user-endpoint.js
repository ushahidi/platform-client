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

    var UserEndpoint = $resource(Util.apiUrl('/users/:id'), {
        id: '@id'
    }, {
        query: {
            method: 'GET',
            isArray: false,
            paramSerializer: '$httpParamSerializerJQLike',
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

    UserEndpoint.getFresh = function (params) {
        cache.remove(Util.apiUrl('/users/' + params.id));
        return UserEndpoint.get(params);
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
