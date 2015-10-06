module.exports = [
    '$resource',
    'Util',
    'CacheFactory',
function (
    $resource,
    Util,
    CacheFactory
) {
    var cache = new CacheFactory('formCache');

    var FormEndpoint = $resource(Util.apiUrl('/forms/:id'), {
            id: '@id'
        }, {
        query: {
            method: 'GET',
            isArray: true,
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

    return FormEndpoint;

}];
