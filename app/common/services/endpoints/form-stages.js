module.exports = [
    '$resource',
    'Util',
    'CacheFactory',
function (
    $resource,
    Util,
    CacheFactory
) {
    var cache = new CacheFactory('stageCache');

    var FormStageEndpoint = $resource(Util.apiUrl('/forms/:formId/stages/:id'), {
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
            },
            cache: cache
        },
        get: {
            method: 'GET',
            cache: cache
        },
        update: {
            method: 'PUT'
        }
    });

    return FormStageEndpoint;
}];
