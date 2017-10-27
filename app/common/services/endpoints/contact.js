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

    if (!(cache = CacheFactory.get('userCache'))) {
        cache = CacheFactory.createCache('userCache');
    }
    cache.removeExpired();

    var ContactEndpoint = $resource(Util.apiUrl('/contacts/:id'), {
        id: '@id'
    }, {
        query: {
            method: 'GET',
            isArray: true,
            transformResponse: function (data /*, header*/) {
                return angular.fromJson(data).results;
            },
            cache: cache
        },
        get: {
            method: 'GET',
            params: {'ignore403': '@ignore403'},
            cache: cache
        },
        update: {
            method: 'PUT'
        }
    });

    ContactEndpoint.getFresh = function (params) {
        cache.remove(Util.apiUrl('/contacts/' + params.id));
        return ContactEndpoint.get(params);
    };

    ContactEndpoint.invalidateCache = function () {
        return cache.removeAll();
    };

    ContactEndpoint.queryFresh = function (params) {
        cache.removeAll();
        return ContactEndpoint.query(params);
    };

    ContactEndpoint.saveCache = function (item) {
        var persist = item.id ? ContactEndpoint.update : ContactEndpoint.save;
        cache.removeAll();
        return persist(item);
    };

    ContactEndpoint.delete = function (item) {
        cache.removeAll();
        var result = ContactEndpoint.deleteEntity(item);
        return result;
    };

    return ContactEndpoint;
}];
