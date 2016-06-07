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
        update: {
            method: 'PUT'
        },
        get: {
            method: 'GET',
            cache: cache,
            params: {'ignore403': '@ignore403'}
        },
        deleteEntity: {
            method: 'DELETE'
        }
    });

    TagEndpoint.getFresh = function (params) {
        cache.remove(Util.apiUrl('/tags/' + params.id));
        return TagEndpoint.get(params);
    };

    TagEndpoint.queryFresh = function () {
        cache.removeAll();
        return TagEndpoint.query();
    };

    TagEndpoint.invalidateCache = function () {
        return cache.removeAll();
    };

    TagEndpoint.saveCache = function (item) {
        var persist = item.id ? TagEndpoint.update : TagEndpoint.save;
        cache.removeAll();
        var result = persist(item);
        return result;
    };

    TagEndpoint.delete = function (item) {
        cache.removeAll();
        var result = TagEndpoint.deleteEntity(item);
        return result;
    };

    $rootScope.$on('event:authentication:logout:succeeded', function () {
        TagEndpoint.query();
    });

    return TagEndpoint;

}];
