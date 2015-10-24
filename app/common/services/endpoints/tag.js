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

    if (!(cache = CacheFactory.get('tagCache'))) {
        cache = new CacheFactory('tagCache');
    }

    cache.setOnExpire(function (key, value) {
        TagEndpoint.get(value.id);
    });

    var TagEndpoint = $resource(Util.apiUrl('/tags/:id'), {
        id: '@id'
    }, {
        query: {
            method: 'GET',
            isArray: true,
            cache: cache,
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
        }
    });

    TagEndpoint.getFresh = function (id) {
        cache.remove(Util.apiUrl(id));
        return TagEndpoint.get(id);
    };

    TagEndpoint.queryFresh = function () {
        cache.removeAll();
        return TagEndpoint.query();
    };

    TagEndpoint.saveCache = function (item) {
        var persist = item.id ? TagEndpoint.update : TagEndpoint.save;
        cache.removeAll();
        var result = persist(item);
        return result;
    };

    TagEndpoint.deleteCache = function (item) {
        cache.removeAll();
        var result = TagEndpoint.delete(item);
        return result;
    };

    $rootScope.$on('event:authentication:logout:succeeded', function () {
        TagEndpoint.query();
    });

    return TagEndpoint;

}];
