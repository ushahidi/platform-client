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
    var cache = CacheFactory('configCache');

    var transformAndRemoveId = _.partial(Util.transformResponse, _, ['id']);

    var ConfigEndpoint = $resource(Util.apiUrl('/config/:id'), {
        'id': '@id'
    }, {
        get: {
            method: 'GET',
            transformResponse: transformAndRemoveId,
            cache: cache
        },
        update: {
            method: 'PUT',
            transformResponse: transformAndRemoveId
        }
    });

    return ConfigEndpoint;

}];
