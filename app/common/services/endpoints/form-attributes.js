module.exports = [
    '$resource',
    'Util',
    'CacheFactory',
function (
    $resource,
    Util,
    CacheFactory
) {
    var cache = CacheFactory('attrCache');

    var FormAttributeEndpoint = $resource(Util.apiUrl('/forms/:formId/attributes/:id'), {
        formId: '@formId',
        id: '@id',
        order: 'asc',
        orderby: 'priority'
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
        },
        delete: {
            method: 'DELETE'
        }
    });

    return FormAttributeEndpoint;
}];
