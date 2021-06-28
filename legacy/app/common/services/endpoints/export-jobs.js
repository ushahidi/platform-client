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
    if (!(cache = CacheFactory.get('exportJobCache'))) {
        cache = CacheFactory.createCache('exportJobCache');
    }
    cache.removeExpired();

    var ExportJobEndpoint = $resource(Util.apiUrl('/exports/jobs/:id'), {
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

    ExportJobEndpoint.getFresh = function (params) {
        cache.remove(Util.apiUrl('/exports/jobs/' + params.id));
        return ExportJobEndpoint.get(params);
    };

    ExportJobEndpoint.queryFresh = function (params) {
        cache.removeAll();
        return ExportJobEndpoint.query(params);
    };

    ExportJobEndpoint.invalidateCache = function () {
        return cache.removeAll();
    };

    ExportJobEndpoint.saveCache = function (item) {
        var persist = item.id ? ExportJobEndpoint.update : ExportJobEndpoint.save;
        cache.removeAll();
        var result = persist(item);
        return result;
    };

    ExportJobEndpoint.delete = function (item) {
        cache.removeAll();
        var result = ExportJobEndpoint.deleteEntity(item);
        return result;
    };

    return ExportJobEndpoint;

}];
