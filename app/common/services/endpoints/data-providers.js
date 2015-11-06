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

    if (!(cache = new CacheFactory.get('providerCache'))) {
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
        options: {
            method: 'OPTIONS'
        }
    });

    return DataProviderEndpoint;

}];
