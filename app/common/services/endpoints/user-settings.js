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

    if (!(cache = CacheFactory.get('userSettingsCache'))) {
        cache = CacheFactory.createCache('userSettingsCache');
    }
    cache.removeExpired();

    var UserSettingsEndpoint = $resource(Util.apiUrl('/users/:id/settings'), {
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

    UserSettingsEndpoint.getFresh = function (params) {
        cache.remove(Util.apiUrl('/users/' + params.id + '/settings'));
        return UserSettingsEndpoint.get(params);
    };

    UserSettingsEndpoint.invalidateCache = function () {
        return cache.removeAll();
    };

    UserSettingsEndpoint.queryFresh = function (params) {
        cache.removeAll();
        return UserSettingsEndpoint.query(params);
    };

    UserSettingsEndpoint.saveCache = function (item) {
        var persist = item.id ? UserSettingsEndpoint.update : UserSettingsEndpoint.save;
        cache.removeAll();
        return persist(item);
    };

    UserSettingsEndpoint.delete = function (item) {
        cache.removeAll();
        var result = UserSettingsEndpoint.deleteEntity(item);
        return result;
    };

    return UserSettingsEndpoint;
}];
