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

    if (!(cache = CacheFactory.get('providerCache'))) {
        cache = new CacheFactory('providerCache');
    }

    var DataProviderEndpoint = $resource(Util.apiUrl('/dataproviders/:id'), {
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
        options: {
            method: 'OPTIONS'
        },
        deleteEntity: {
            method: 'DELETE'
        }
    });

    DataProviderEndpoint.getFresh = function (params) {
        cache.remove(Util.apiUrl('/dataproviders/' + params.id));
        return DataProviderEndpoint.get(params);
    };

    DataProviderEndpoint.queryFresh = function () {
        cache.removeAll();
        return DataProviderEndpoint.query();
    };

    DataProviderEndpoint.invalidateCache = function () {
        return cache.removeAll();
    };

    DataProviderEndpoint.saveCache = function (item) {
        var persist = item.id ? DataProviderEndpoint.update : DataProviderEndpoint.save;
        cache.removeAll();
        var result = persist(item);
        return result;
    };

    DataProviderEndpoint.delete = function (item) {
        cache.removeAll();
        var result = DataProviderEndpoint.deleteEntity(item);
        return result;
    };


    return DataProviderEndpoint;

}];
