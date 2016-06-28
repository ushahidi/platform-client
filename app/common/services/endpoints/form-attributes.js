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

    if (!(cache = CacheFactory.get('attrCache'))) {
        cache = new CacheFactory('attrCache');
    }

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
            },
            cache: cache
        },
        get: {
            method: 'GET',
            cache: cache
        },
        update: {
            method: 'PUT'
        },
        deleteEntity: {
            method: 'DELETE'
        }
    });

    FormAttributeEndpoint.getFresh = function (params) {
        cache.remove(Util.apiUrl('/forms/' + params.formId + '/attributes/' + params.id));
        return FormAttributeEndpoint.get(params);
    };

    FormAttributeEndpoint.queryFresh = function (params) {
        cache.removeAll();
        return FormAttributeEndpoint.query(params);
    };

    FormAttributeEndpoint.saveCache = function (item) {
        var persist = item.id ? FormAttributeEndpoint.update : FormAttributeEndpoint.save;

        cache.removeAll();
        return persist(item);
    };

    FormAttributeEndpoint.invalidateCache = function () {
        return cache.removeAll();
    };

    FormAttributeEndpoint.delete = function (item) {
        cache.removeAll();
        return FormAttributeEndpoint.deleteEntity(item);
    };

    return FormAttributeEndpoint;
}];
