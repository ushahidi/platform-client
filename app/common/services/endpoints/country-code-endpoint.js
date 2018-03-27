module.exports = [
    '$resource',
    'Util',
    'CacheFactory',
function (
    $resource,
    Util,
    CacheFactory
) {
    var cache;
    if (!(cache = CacheFactory.get('countryCodes'))) {
        cache = CacheFactory.createCache('countryCodes');
    }
    cache.removeExpired();

    var CountryCodeEndpoint = $resource(Util.apiUrl('/country-codes/'), {
    }, {
        query: {
            method: 'GET',
            isArray: true,
            cache: cache,
            transformResponse: function (data) {
                return Util.transformResponse(data).results;
            }
        }
    });

    return CountryCodeEndpoint;
}];
