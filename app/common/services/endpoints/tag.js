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
    var cache = new CacheFactory('tagCache');

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

    $rootScope.$on('event:authentication:logout:succeeded', function () {
        TagEndpoint.query();
    });

    return TagEndpoint;

}];
