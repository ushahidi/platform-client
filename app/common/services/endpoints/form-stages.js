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

    FormStageEndpoint.getFresh = function (id) {
        cache.remove(Util.apiUrl(id));
        return FormStageEndpoint.get(id);
    };

    FormStageEndpoint.queryFresh = function() {
        cache.removeAll();
        return FormStageEndpoint.query();
    };

    FormStageEndpoint.saveCache = function (item) {
        var persist = item.id ? FormStageEndpoint.update : FormStageEndpoint.save;
        cache.removeAll();
        var result = persist(item);
        return result;
    };


    return FormStageEndpoint;
}];
